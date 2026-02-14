import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

const StarRatingComponent = ({ rating,handleRatingChange }) => {
  return [1, 2, 3, 4, 5].map((currentstarClicked) => (
    <Button
      className={`p-2 rounded-full transition-colors ${currentstarClicked <= rating ? "text-yellow-500 hover:bg-black" : "text-black hover:bg-primary hover:text-primary-foreground"}`}
      variant="outline"
      size="icon"
      onClick={()=>handleRatingChange(currentstarClicked)}
    >
      <StarIcon className={`w-6 h-6 ${currentstarClicked<=rating?'fill-yellow-500':'fill-black'}`}/>
    </Button>
  )); 
};

export default StarRatingComponent;
