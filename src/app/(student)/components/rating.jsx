import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/utils";
import { Star } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Rating({ courseId, fetchCourse }) {
   const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
   const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
   const { data: session } = useSession();
   const [reviews, setReviews] = useState([]);
   const [rating, setRating] = useState(0);
   const [hoveredRating, setHoveredRating] = useState(0);
   const [comment, setComment] = useState("");
   const handleStarClick = (value) => {
      setRating(rating === value ? 0 : value);
   };

   const handleStarHover = (value) => {
      setHoveredRating(value);
   };

   const displayRating = hoveredRating || rating;

   const fetchReviews = async () => {
      try {
         const res = await fetch(`${BACKEND}.review.get_reviews_course?courseId=${courseId}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "Accept": "application/json",
            }
         })
         const response = await res.json();
         console.log(response);

         if (response.responseType === "ok") {
            setReviews(response.data || []);
         } else {
            console.log(response.desc);
         }
      } catch (error) {
         console.log("Error fetching reviews:", error);
      }
   }

   useEffect(() => {
      fetchReviews();
   }, [])

   const submitReview = async () => {
      try {
         const session = await getSession();
         const res = await fetch(`${BACKEND}.review.create_review`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session?.user?.accessToken}`
            },
            body: JSON.stringify({
               courseId: courseId,
               rating: parseFloat(rating),
               reviewText: comment
            })
         });
         const response = await res.json();
         if (response.responseType === "ok") {
            toast.success("Сэтгэгдэл амжилттай илгээгдлээ.");
            setRating(0);
            setComment("");
            fetchReviews();
            fetchCourse();
         } else {
            toast.error(response.desc || "Сэтгэгдэл илгээхэд алдаа гарлаа.");
         }
      } catch (error) {
         toast.error("Сэтгэгдэл илгээхэд алдаа гарлаа.");
         console.log(error);
      }
   }

   function StarRating(rating, maxRating = 5) {
      const filledStars = Math.round(rating);
      const emptyStars = maxRating - filledStars;

      return (
         <div className="flex gap-1">
            {/* Filled stars */}
            {[...Array(filledStars)].map((_, i) => (
               <Star
                  key={`filled-${i}`}
                  size={20}
                  className="fill-yellow-400 text-yellow-400"
               />
            ))}

            {/* Empty stars */}
            {[...Array(emptyStars)].map((_, i) => (
               <Star
                  key={`empty-${i}`}
                  size={20}
                  className="text-gray-300"
               />
            ))}
         </div>
      );
   }
   return (
      <>
         <h2 className="text-xl font-semibold">Сургалтын үнэлгээ, сэтгэгдэл</h2>
         <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col gap-4 border border-gray-200 rounded-xl p-4">
               <div className="flex items-center gap-4">
                  <Avatar>
                     <AvatarImage src={`${BASE_URL}/${session?.user?.user?.user_image}`} alt="profile" />
                     <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                     <div className="font-semibold">{session?.user?.user?.first_name} {session?.user?.user?.last_name}</div>
                     <div className="text-sm text-gray-600">{session?.user?.user?.email}</div>
                  </div>
               </div>
               <div className="flex gap-4">
                  Үнэлгээ:
                  {[1, 2, 3, 4, 5].map((value) => (
                     <button
                        key={value}
                        onClick={() => handleStarClick(value)}
                        onMouseEnter={() => handleStarHover(value)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform transform hover:scale-110 focus:outline-none"
                        aria-label={`Rate ${value} stars`}
                     >
                        <Star
                           size={24}
                           className={`transition-all ${value <= displayRating
                              ? 'fill-yellow-400 stroke-yellow-400'
                              : 'stroke-gray-300 fill-none'
                              }`}
                        />
                     </button>
                  ))}
               </div>
               <Textarea
                  placeholder="Сургалтын сэтгэгдэл оруулах..."
                  onChange={(e) => setComment(e.target.value)}
               />
               <Button
                  className="bg-yellow-500 hover:bg-yellow-600"
                  onClick={submitReview}
               >Илгээх</Button>
            </div>
            {reviews.length > 0 ?
               <>
                  <div className="flex flex-col gap-4">
                     {reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                           <div className="flex justify-between items-center gap-4 mb-2">
                              <div className="flex items-center gap-4">
                                 <Avatar>
                                    <AvatarImage src={`${BASE_URL}/${review.user_image}`} alt="profile" />
                                    <AvatarFallback>{review.full_name
                                       .split(' ')
                                       .map(word => word[0])
                                       .join('')}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div className="flex flex-col">
                                    <p className="font-semibold">{review.full_name}</p>
                                    <div className="flex items-center gap-1">
                                       {StarRating(review.rating)}
                                    </div>
                                 </div>
                              </div>
                              <div>{formatDateTime(review.creation)}</div>
                           </div>
                           <div>{review.review_text}</div>
                        </div>
                     ))}
                  </div>
               </> :
               <p className="w-full text-center">Хоосон байна.</p>
            }
         </div>
      </>
   );
}