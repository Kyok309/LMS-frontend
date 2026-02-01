import Loading from "@/components/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/utils";
import { Star } from "lucide-react";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ReviewList({instructorId}) {
   const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
   const [reviews, setReviews] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

   useEffect(() => {
      const fetchInstructorReviews = async () => {
         try {
            const session = await getSession();
            const res = await fetch(`${BACKEND}.review.get_reviews_instructor?instructorId=${instructorId}`, {
               method: "GET",
               headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${session?.user?.accessToken}`
               }
            })

            const response = await res.json()
            console.log(response)
            if (response.responseType === "ok") {
               setReviews(response.data)
            }
         } catch (error) {
            console.log(error)
         } finally {
            setIsLoading(false);
         }
      }
      fetchInstructorReviews()
   }, [])

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

   if (isLoading) {
      return <Loading />
   }
   return (
      <>
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
                                 <p className="text-gray-500 text-sm">{review.email}</p>
                              </div>
                           </div>
                           <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1">
                                    {StarRating(review.rating)}
                                 </div>
                              {formatDateTime(review.creation)}
                           </div>
                        </div>
                        <div>{review.review_text}</div>
                     </div>
                  ))}
               </div>
            </> :
            <p className="w-full text-center">Хоосон байна.</p>
         }
      </>
   );
}