"use client";

import { useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import {  Button } from "@heroui/button";
import { Games, sreenshoots } from "@/types/database";
import { Image } from "@heroui/image";




export  function CarouselGameDetail({ images }: {images:sreenshoots[]}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    if (currentIndex < images.length - 1) {
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
      className="h-[470px] flex items-center justify-center"
    >
      <CardBody className=" ">
        <Image   className="w-full h-full object-cover" src={`${images[currentIndex].screenshot_url}`}></Image>
        <Button className="absolute z-20 left-0 top-1/2" variant="ghost"
          color="primary"
          isIconOnly
          isDisabled={currentIndex === 0}
          onPress={previous}
        >
          {"<"}
        </Button>

        <Button className="absolute z-20 right-0 top-1/2"
        variant="ghost"
          color="primary"
          isIconOnly
          isDisabled={currentIndex === images.length - 1}
          onPress={next}
        >
          {">"}
        </Button>
      </CardBody>

      {/* <CardFooter className="bg-black/40 text-white items-start  flex flex-col  h-60">
      <h2 className=" uppercase font-bold text-4xl mb-10">
        {games[currentIndex].title}

      </h2>
      <p className="w-1/2">
        {games[currentIndex].description.slice(0,300)+'...'}
      </p>
      <span className="mt-5">
        <Button variant="solid" color="primary">Buy now</Button>
        

      </span>
       
      </CardFooter> */}
    </Card>
  );
}
