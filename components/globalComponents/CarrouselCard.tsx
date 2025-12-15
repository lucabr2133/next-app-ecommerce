"use client";

import { useState, useEffect } from "react";
import { Games } from "@/types/database";
import { ProductCart } from "./Card";
import { Card, CardBody, Button, Divider } from "@heroui/react";

export function CarouselCard({ games }: { games: Games[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  const updatedGames = [...games, {
    id: "11",
    title: "See more",
    create_at: new Date(),
    description: "",
    id_developer: "",
    id_platform: "",
    img_url: "",
    metacritic: 0,
    price: 70,
    release_at: new Date(),
    stock: 0,
    updated_at: new Date()
  }];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsPerView(1);      
      else if (window.innerWidth < 1024) setCardsPerView(2); 
      else setCardsPerView(3);                              
    };
    handleResize(); // ejecutar al montar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gameLength= updatedGames.length - cardsPerView;
  
  const next = () => {
    if (currentIndex < gameLength) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Card className="bg-transparent w-full overflow-hidden">
      <CardBody className="flex justify-between items-center flex-row gap-2 sm:gap-4">
        <Button
          variant="ghost"
          color="primary"
          isIconOnly
          isDisabled={currentIndex === 0}
          onPress={previous}
        >
          {"<"}
        </Button>

        <div className="flex flex-row justify-center items-center w-full gap-4">
          {updatedGames
            .slice(currentIndex, currentIndex + cardsPerView)
            .map((game) => (
              <div
                key={game.id}
                className="flex-1 min-w-[200px] "
              >
                <ProductCart setGames={null} game={game} />
              </div>
            ))}
        </div>

        <Button
          variant="ghost"
          color="primary"
          isIconOnly
          isDisabled={currentIndex >= gameLength}
          onPress={next}
        >
          {">"}
        </Button>
      </CardBody>
      <Divider></Divider>
    </Card>
  );
}
