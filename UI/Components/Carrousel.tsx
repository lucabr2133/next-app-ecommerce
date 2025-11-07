"use client";

import { useState } from "react";

import { Games } from "@/types/database";
import { Card, CardBody, Button, CardFooter } from "@heroui/react";




export  function Carousel({ games }: {games:Games[]}) {
  const images = games.map((game) => game.img_url);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
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
      className="col-start-1 col-end-5 relative flex items-end bg-cover bg-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          filter: hovered ? "blur(0px)" : "blur(1px)",
          transition: "filter 0.7s ease",
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

      <CardBody className="flex justify-between items-center flex-row relative z-10">
        <Button
          variant="ghost"
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

      <CardFooter className="bg-black/20 p-5  text-white items-start flex flex-col z-10 transition-all  " style={{opacity:hovered?'1':'0',transition:'all 0.3s ease'}}>
        <h2 className="text-4xl md:text-4xl font-extrabold uppercase tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {games[currentIndex].title}
        </h2>
        <p className="w-1/2 max-w-3xl text-lg md:text-xl leading-relaxed text-gray-200 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
          {games[currentIndex].description.slice(0, 300) + "..."}
        </p>
        <span className="mt-5 pointer-events-auto">
          <Button variant="solid" color="primary">
            Buy now
          </Button>
        </span>
      </CardFooter>
    </Card>
  );
}
