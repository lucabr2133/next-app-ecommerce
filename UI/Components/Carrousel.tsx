"use client";

import { useState } from "react";

import { Games } from "@/types/database";
import { Card, CardBody, Button, CardFooter } from "@heroui/react";




export  function Carousel({ games }: {games:Games[]}) {
  const images = games.map((game) => game.img_url);
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
      className="col-start-1 col-end-5   bg-center"
      style={{ backgroundImage: `url(${images[currentIndex]})`,backgroundSize:"100%" }}
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

        <Button
        variant="ghost"
          color="primary"
          isIconOnly
          isDisabled={currentIndex === images.length - 1}
          onPress={next}
        >
          {">"}
        </Button>
      </CardBody>

      <CardFooter className="bg-black/40 text-white items-start  flex flex-col  h-60">
      <h2 className=" uppercase font-bold text-4xl mb-10">
        {games[currentIndex].title}

      </h2>
      <p className="w-1/2">
        {games[currentIndex].description.slice(0,300)+'...'}
      </p>
      <span className="mt-5">
        <Button variant="solid" color="primary">Buy now</Button>
        

      </span>
       
      </CardFooter>
    </Card>
  );
}
