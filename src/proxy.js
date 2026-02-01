import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const AUTH_ROUTES = ["/auth"];
const STUDENT_ROUTES = ["/profile", "/profile/enrollments"];
const INSTRUCTOR_ROUTES = ["/instructor"];
const ENROLLED_ROUTES = ["/courses/[courseId]/lessons"];
const CERTIFICATE_ROUTE = ["/courses/[courseId]/certificate"];

function isAuthRoute(pathname) {
  return AUTH_ROUTES.includes(pathname);
}

function isStudentRoute(pathname) {
  return STUDENT_ROUTES.includes(pathname);
}

function isInstructorRoute(pathname) {
  return INSTRUCTOR_ROUTES.some((route) => pathname.startsWith(route));
}

function isEnrolledRoute(pathname) {
  return ENROLLED_ROUTES.some((route) => {
    const pattern = route.replace(/\[(\w+)\]/g, "[^/]+");
    const regex = new RegExp(`^${pattern}(/|$)`);
    return regex.test(pathname);
  });
}

function isCertificateRoute(pathname) {
  return CERTIFICATE_ROUTE.some((route) => {
    const pattern = route.replace(/\[(\w+)\]/g, "[^/]+");
    const regex = new RegExp(`^${pattern}(/|$)`);
    return regex.test(pathname);
  });
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const authed = session&&session.user ? true : false;
  const isStudent = session?.user?.roles?.includes("Student") ? true : false;
  const isInstructor = session?.user?.roles?.includes("Instructor") ? true : false;

  if (isAuthRoute(pathname) && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isStudentRoute(pathname) && !isStudent) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isInstructorRoute(pathname) && !isInstructor) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isCertificateRoute(pathname) && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  
  const fetchEnrollmentStatus = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}.enrollment.check_enrollment_api?courseId=${pathname.split("/")[2]}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      }
    });
    if (!res.ok) {
      return false;
    } else {
      const response = await res.json();
      return response.data.enrolled;
    }
  };

  if (isEnrolledRoute(pathname) && authed) {
    const enrolled = await fetchEnrollmentStatus();
    if (!enrolled) {
      const url = request.nextUrl.clone();
      url.pathname = `/courses/${pathname.split("/")[2]}`;
      return NextResponse.redirect(url);
    }
  } else if (isEnrolledRoute(pathname) && !authed) {
      const url = request.nextUrl.clone();
      url.pathname = `/courses/${pathname.split("/")[2]}`;
      return NextResponse.redirect(url);
    }

  return NextResponse.next();
}