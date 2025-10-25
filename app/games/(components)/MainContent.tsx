"use client"
import { Games, sreenshoots, tags } from "@/types/database";
import { ProductCart } from "@/UI/Components/Card";

import { CarouselGameDetail } from "./Carroulsel";
import { Card, CardBody, Chip, Button,Image } from "@heroui/react";
export default function MainContent({game,tags,screenshoots}:{game:Games,tags:tags[],screenshoots:sreenshoots[]}){
    return (
    <section className="w-full m-0 p-0 text-gray-100">
      <div
        className="relative min-h-screen flex items-end bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${game.img_url})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent backdrop-blur-[2px]" />

        <div className="relative z-10 w-full p-16 flex flex-col gap-6 max-w-5xl">
          <h1 className="text-6xl md:text-7xl font-extrabold uppercase tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {game.title}
          </h1>

          <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-gray-200 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
            {game.description}
          </p>

          <div className="flex flex-wrap gap-3 uppercase">
            {tags.map((tag) => (
              <Chip
                key={tag.tag_id}
                variant="bordered"
                color="warning"
                size="sm"
                radius="sm"
                className="hover:scale-110 transition-transform"
              >
                {tag.tag_name}
              </Chip>
            ))}
          </div>

          <Button
            className="mt-6 w-48 py-6 text-lg font-semibold shadow-lg 
                       bg-gradient-to-r from-yellow-500 to-orange-600 
                       hover:from-yellow-400 hover:to-orange-500 
                       hover:shadow-[0_0_20px_rgba(255,165,0,0.6)] 
                       transition-all duration-300"
            color="warning"
            variant="shadow"
          >
            Buy Now
          </Button>
        </div>
      </div>

      <div className="m-8 grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
        <div className="w-full max-w-3xl">
          <CarouselGameDetail images={screenshoots} />
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {screenshoots.map((screenshot) => (
            <Card
              key={screenshot.id}
              className="w-56 h-36 overflow-hidden rounded-2xl shadow-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-300"
            >
              <CardBody className="p-0">
                <Image
                  src={screenshot.screenshot_url}
                  alt="Screenshot"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full h-2 bg-gradient-to-r from-yellow-500 to-orange-600" />
    </section>
  );

}