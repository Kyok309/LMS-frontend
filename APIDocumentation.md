<a id="readme-top"></a>

# LMS API гарын авлага (Frontend ашиглалт)

## Ерөнхий танилцуулга

Энэхүү гарын авлага нь энэ frontend-ээс LMS backend API-тай хэрхэн холбогдож ажиллахыг тайлбарлана.  
Backend URL-ууд нь орчноос хамаарч **`NEXT_PUBLIC_BACKEND`** хувьсагчаар тодорхойлогдоно.

```text
BACKEND = NEXT_PUBLIC_BACKEND

Жишээ:
BACKEND = https://api.example.com/api/method/lms.
```

Доорх бүх endpoint-ууд дараах хэлбэртэй байна:

```text
{BACKEND}.{resource}.{method}
жишээ: https://api.example.com/api/method/lms.auth.login
```

Бүх endpoint-ууд хүсэлт болон хариуг **JSON** хэлбэрээр ашиглана (refresh token гэх зарим endpoint `x-www-form-urlencoded`).

---

## Үндсэн API-ууд

- Хэрэглэгч бүртгүүлэх
- Нэвтрэх
- Access token шинэчлэх (OAuth2 refresh)
- Профайл мэдээлэл авах / шинэчлэх
- Суралцагч хяналтын самбарын мэдээлэл авах
- Багшийн хяналтын самбарын мэдээлэл авах
- Багш сургалт, хичээл, шалгалт үүсгэх
- Сургалт, хичээл, шалгалтын мэдээлэл авах
- Сургалт худалдан авах (Stripe checkout)
- Элсэлт үүсгэх
- Сертификат авах, PDF татах
- Мэдэгдэл (notification) авах / уншсанаар тэмдэглэх
- Төлбөрийн түүх харах
- Сэтгэгдэл (review) авах / үүсгэх
- Тайлан авах

---

## Аюулгүй байдал, Authentication

Ихэнх хамгаалагдсан endpoint-ууд **Bearer JWT access token** шаардана..

```http
Authorization: Bearer <ACCESS_TOKEN>
Accept: application/json
Content-Type: application/json
```

Access token нь нэвтэрсний дараа (`auth.login`), NextAuth session дотор хадгалагдана.

---

## 1. Нэвтрэлт ба хэрэглэгчийн эрх

### 1.1 Хэрэглэгч нэвтрэх

#### Endpoint

```text
POST {BACKEND}.auth.login
```

#### Тайлбар

Имэйл, нууц үгээр нэвтэрч **JWT access/refresh token**, хэрэглэгчийн мэдээлэл болон ролуудыг буцаана. Frontend талд NextAuth (`Credentials` provider) ашиглан дуудаж байна.

#### Хүсэлт

Body (JSON):

```json
{
  "email": "user@example.com",
  "password": "pass1234"
}
```

#### Хариу (амжилттай)

```json
{
  "responseType": "ok",
  "data": {
    "access_token": "<ACCESS_TOKEN>",
    "refresh_token": "<REFRESH_TOKEN>",
    "expires_in": 900,
    "roles": ["Student", "Instructor"],
    "user": {
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe"
      // ...
    }
  },
  "desc": "Амжилттай нэвтэрлээ."
}
```

#### Хариу (алдаа)

```json
{
  "responseType": "error",
  "desc": "Имэйл эсвэл нууц үг буруу байна."
}
```

---

### 1.2 Шинэ хэрэглэгч бүртгүүлэх

#### Endpoint

```text
POST {BACKEND}.auth.signup
```

#### Тайлбар

Frontend дахь `AuthClient` бүртгэлийн формоос дуудна. Суралцагч (`Student`) эсвэл багш (`Instructor`) төрлөөр бүртгүүлж болно.

#### Хүсэлт

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": 99119911,
  "password": "pass1234",
  "role": "Student" // эсвэл "Instructor"
}
```

#### Хариу (амжилттай)

```json
{
  "responseType": "ok",
  "desc": "Бүртгэл амжилттай үүслээ."
}
```

#### Хариу (алдаа)

```json
{
  "responseType": "error",
  "desc": "И-мэйл давхцаж байна."
}
```

---

### 1.3 Нууц үг солих (login хийсэн хэрэглэгч)

#### Endpoint

```text
POST {BACKEND}.auth.change_password
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

#### Хүсэлт

```json
{
  "old_password": "oldPass123",
  "new_password": "newPass456"
}
```

#### Хариу (амжилттай)

```json
{
  "responseType": "ok",
  "desc": "Password updated successfully!"
}
```

---

### 1.4 Access token refresh (OAuth2)

Энэ үйлдлийг frontend шууд биш, NextAuth доторх `auth.js` файл автоматаар гүйцэтгэнэ.

#### Endpoint

```text
POST {BASE_URL}/api/method/frappe.integrations.oauth2.get_token
```

энд:

- `BASE_URL = NEXT_PUBLIC_BACKEND_URL`

#### Хүсэлт (`application/x-www-form-urlencoded`)

Параметрүүд:

| Name          | Төрөл   | Заавал | Тайлбар                 |
| ------------- | ------- | ------ | ----------------------- |
| grant_type    | string | Yes    | `refresh_token`         |
| refresh_token | string | Yes    | Хуучин refresh token    |
| client_id     | string | Yes    | `FRAPPE_CLIENT_ID`      |
| client_secret | string | Yes    | `FRAPPE_CLIENT_SECRET`  |

---

## 2. Профайл ба хэрэглэгчийн мэдээлэл

### 2.1 Нэвтэрсэн хэрэглэгчийн мэдээлэл авах

Frontend `header` компонент ашигладаг.

#### Endpoint

```text
GET {BACKEND}.auth.get_me
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

#### Хариу (жишээ)

```json
{
  "responseType": "ok",
  "data": {
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "roles": ["Student"],
    "image": "/files/avatar.png"
  }
}
```

---

### 2.2 Суралцагчийн профайл авах

`/profile` хуудсан дээр ашиглана.

#### Endpoint

```text
GET {BACKEND}.student.get_student_profile
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

#### Хариу (жишээ)

```json
{
  "responseType": "ok",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "99119911",
    "education_level": "Bachelor",
    "school": "NUM",
    "user_image": "/files/profile.jpg"
  }
}
```

---

### 2.3 Суралцагчийн профайл шинэчлэх

#### Endpoint

```text
PUT {BACKEND}.student.update_student_profile
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

#### Хүсэлт (жишээ)

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "education_level": "Masters",
  "school": "MUST",
  "email": "john.doe@example.com",
  "phone": "99119911",
  "user_image": "/files/profile.jpg"
}
```

#### Хариу

```json
{
  "responseType": "ok",
  "desc": "Profile updated"
}
```

---

### 2.4 Профайл зураг upload хийх

Frontend `BASE_URL` ашиглан шууд Frappe upload endpoint рүү хүсэлт явуулна.

#### Endpoint

```text
POST {BASE_URL}/api/method/upload_file
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

#### Хүсэлт

- `multipart/form-data` (`file` талбар)

#### Хариу (жишээ)

```json
{
  "message": {
    "file_url": "/files/profile.jpg"
  }
}
```

---

## 3. Хяналтын самбар (Dashboard)

### 3.1 Суралцагчийн хяналтын самбар

#### Endpoint

```text
GET {BACKEND}.dashboard.get_dashboard
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

#### Хариу (түлхүүр талбарууд)

```json
{
  "responseType": "ok",
  "data": {
    "enrolled_courses": 5,
    "finished_courses": 2,
    "finished_lessons": 30,
    "average_score": 85.5,
    "completion_rate": 60.2,
    "completed_lesson_week": [
      { "label": "Week 1", "done_count": 5 },
      { "label": "Week 2", "done_count": 7 }
    ],
    "course_category": [
      { "category_name": "Web Development", "courses": 3 },
      { "category_name": "Data Science", "courses": 2 }
    ],
    "avg_course": [
      { "course_title": "React Basics", "average_score": 88 },
      { "course_title": "Python 101", "average_score": 92 }
    ]
  }
}
```

---

### 3.2 Багшийн хяналтын самбар

#### Endpoint

```text
GET {BACKEND}.dashboard.get_dashboard_instructor
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

Хариу нь нийт элсэлт, сургалт бүрийн дундаж оноо, сар бүрийн элсэлт гэх мэт мэдээллийг агуулна (frontend дээр `total_enrollments`, `average_score_course`, `enrollment_month` талбаруудаар ашиглаж байна).

---

## 4. Сургалт, элсэлт, гэрчилгээ

### 4.1 Сургалтуудын жагсаалт (суралцагч)

#### Endpoint

```text
GET {BACKEND}.course.get_courses
```

#### Query параметрүүд (жишээ)

`/courses` хуудаснаас:

```text
{BACKEND}.course.get_courses?search=<q>&page=<page>&page_size=<size>&category=<id>&level=<level>
```

Тодорхой параметрүүд:

| Нэр       | Төрөл  | Заавал | Тайлбар                     |
|----------|--------|--------|-----------------------------|
| search   | string | No     | Хайлт (course title гэх мэт) |
| page     | int    | No     | Хуудасны дугаар            |
| page_size| int    | No     | Нэг хуудсан дахь тоо       |
| category | string | No     | Ангилал                     |
| level    | string | No     | Түвшин (Beginner, etc.)    |

---

### 4.2 Нэг сургалтын мэдээлэл

#### Endpoint

```text
GET {BACKEND}.course.get_course?courseId=<COURSE_ID>
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN> (сонголтоор, enrollment/хандалт хамаарч)
```

Хариу нь сургалтын үндсэн мэдээлэл, багш, хичээлүүд, үнэлгээ гэх мэт талбаруудыг агуулна.

---

### 4.3 Сургалт худалдан авах (Stripe Checkout)

#### Endpoint

```text
POST {BACKEND}.stripe.create_checkout_session
```

#### Query

```text
?courseId=<COURSE_ID>
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

#### Хариу (жишээ)

```json
{
  "responseType": "ok",
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/c/pay/..."
  }
}
```

---

### 4.4 Элсэлт үүсгэх

Сургалт амжилттай төлөгдсөний дараа enrollment үүсгэнэ.

#### Endpoint

```text
POST {BACKEND}.enrollment.create_enrollment?courseId=<COURSE_ID>
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

### 4.5 Элсэлтийн статус шалгах (route хамгаалалт)

Frontend `src/proxy.js`-д:

#### Endpoint

```text
GET {BACKEND}.enrollment.check_enrollment_api?courseId=<COURSE_ID>
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

Хариу нь тухайн курсэд элссэн эсэхийг илэрхийлэх талбар агуулна (жишээ нь `is_enrolled: true/false`).

---

### 4.6 Гэрчилгээ авах

#### Endpoint-ууд

1. Гэрчилгээний мэдээлэл:

```text
GET {BACKEND}.certificate.get_certificate?courseId=<COURSE_ID>
```

2. Гэрчилгээний PDF файл:

```text
GET {BACKEND}.certificate.get_certificate_file?certificateId=<CERTIFICATE_ID>
```

Хоёр endpoint хоёулаа `Authorization: Bearer <ACCESS_TOKEN>` header ашиглана.

---

## 5. Хичээл, шалгалт, оноо

### 5.1 Сургалтын хичээлүүд (суралцагч)

#### Endpoint

```text
GET {BACKEND}.lesson.get_lessons?courseId=<COURSE_ID>
```

### 5.2 Нэг хичээлийн дэлгэрэнгүй

```text
GET {BACKEND}.lesson.get_lesson?courseId=<COURSE_ID>&lessonId=<LESSON_ID>
```

### 5.3 Шалгалт (Quiz) авах

```text
GET {BACKEND}.quiz.get_quiz?quizId=<QUIZ_ID>&courseId=<COURSE_ID>
```

### 5.4 Шалгалтын асуултууд

```text
GET {BACKEND}.quiz_question.get_quiz_questions?quizId=<QUIZ_ID>&courseId=<COURSE_ID>
```

### 5.5 Шалгалтын submission-ууд

```text
GET {BACKEND}.submission.get_quiz_submissions?quizId=<QUIZ_ID>&courseId=<COURSE_ID>
```

### 5.6 Шалгалтын submission үүсгэх

```text
POST {BACKEND}.submission.create_quiz_submission
```

Body нь асуулт, хариултууд, оноо зэрэг мэдээллийг агуулна.

Бүх дээр нь:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 6. Мэдэгдэл (Notifications)

### 6.1 Мэдэгдлүүдийн жагсаалт авах

#### Endpoint

```text
GET {BACKEND}.notification.get_notifications
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
Accept: application/json
```

#### Хариу (жишээ)

```json
{
  "responseType": "ok",
  "data": [
    {
      "name": "NOTIF-0001",
      "subject": "Шинэ сургалтад элссэн",
      "email_content": "Та React Basics сургалтад амжилттай элссэн.",
      "read": 0,
      "creation": "2025-01-01 10:00:00"
    }
  ]
}
```

---

### 6.2 Мэдэгдлийг уншсанаар тэмдэглэх

#### Endpoint

```text
PUT {BACKEND}.notification.read_notification?notifId=<NOTIFICATION_ID>
```

#### Authentication

```http
Authorization: Bearer <ACCESS_TOKEN>
```

Амжилттай үед `responseType: "ok"` буцаана.

---

## 7. Сэтгэгдэл (Reviews)

### 7.1 Сургалтын сэтгэгдлүүд (суралцагч)

#### Endpoint

```text
GET {BACKEND}.review.get_reviews_course?courseId=<COURSE_ID>
```

### 7.2 Багшийн сэтгэгдлүүд

```text
GET {BACKEND}.review.get_reviews_instructor?instructorId=<INSTRUCTOR_ID>
```

### 7.3 Сэтгэгдэл үүсгэх

```text
POST {BACKEND}.review.create_review
```

Body нь сургалтын ID, рейтинг, тайлбар зэрэг талбар агуулна.

Бүх дээр:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 8. Төлбөрүүд

### 8.1 Суралцагчийн төлбөрийн жагсаалт

#### Endpoint

```text
GET {BACKEND}.payment.get_payments_student
```

### 8.2 Багшийн төлбөрийн жагсаалт

```text
GET {BACKEND}.payment.get_payments_instructor
```

Хоёулаа `Authorization: Bearer <ACCESS_TOKEN>` шаардлагатай.

---

## 9. Бусад endpoint-ууд

- `GET {BACKEND}.category.get_categories` – ангиллуудын жагсаалт
- `GET {BACKEND}.course.get_courses_instructor` – багшийн сургалтууд
- `GET {BACKEND}.instructor.get_instructor_profile` – багшийн профайл
- `PUT {BACKEND}.instructor.update_instructor_profile` – багшийн профайл шинэчлэх
- `GET {BACKEND}.lesson.get_lessons_instructor` – сургалтын хичээлүүд (багш тал)
- `POST {BACKEND}.lesson.create_lesson` – шинэ хичээл үүсгэх
- `PUT {BACKEND}.lesson.update_lessons_order` – хичээлүүдийн дараалал шинэчлэх
- `GET {BACKEND}.report.get_report_instructor` – багшийн тайлангийн мэдээлэл

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>