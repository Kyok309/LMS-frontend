import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const AUTH_ROUTES = ["/auth"];
const STUDENT_ROUTES = ["/profile", "/profile/enrollments"];
const INSTRUCTOR_ROUTES = ["/instructor"];


function isAuthRoute(pathname) {
  return AUTH_ROUTES.includes(pathname);
}

function isStudentRoute(pathname) {
  return STUDENT_ROUTES.includes(pathname);
}

function isInstructorRoute(pathname) {
  return INSTRUCTOR_ROUTES.some((route) => pathname.startsWith(route));
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const authed = session&&session.user ? true : false;
  const isStudent = session&&session.user&&session.user.roles.includes("Student") ? true : false;
  const isInstructor = session&&session.user&&session.user.roles.includes("Instructor") ? true : false;

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

  return NextResponse.next();
}