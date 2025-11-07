"use client";

import { useState } from "react";

import { Games } from "@/types/database";
import { ProductCart } from "./Card";
import { Card, CardBody, Button } from "@heroui/react";




export  function CarouselCard({ games }: {games:Games[]}) {
  const [currentIndex, setCurrentIndex] = useState(0);
games.push({
    id:'11',
    title:'See more',
    create_at:new Date,
    description:'',
    id_developer:'',
    id_platform:'',
    img_url:'',
    metacritic:0,
    price:70,
    release_at:new Date,
    stock:0,
    updated_at:new Date
})
 const gameLengh=11-2
  const next = () => {
    if (currentIndex < gameLengh - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Card
      className="col-start-1 col-end-5   bg-center w-full"
    >
      <CardBody className="flex justify-between items-center flex-row  ">
        <Button variant="ghost"
          color="primary"
          isIconOnly
          isDisabled={currentIndex === 0}
          onPress={previous}
        >
          {"<"}
        </Button>

        <ProductCart game={games[currentIndex]}></ProductCart>
        <ProductCart game={games[currentIndex+1]}></ProductCart>
        <ProductCart game={games[currentIndex+2]}></ProductCart>
   
        <Button
        variant="ghost"
          color="primary"
          isIconOnly
          isDisabled={currentIndex === gameLengh- 1}
          onPress={next}
        >
          {">"}
        </Button>
      </CardBody>

    
    </Card>
  );
}
