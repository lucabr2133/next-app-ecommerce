"use client"

import { Games, Genres } from "@/types/database";
import { ProductCart } from "@/UI/Components/Card";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Radio, RadioGroup, Listbox, ListboxItem ,Selection} from "@heroui/react";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Pagination } from "./Pagination";
import { notFound, usePathname, useRouter, useSearchParams } from "next/navigation";
export function MainGames({data,genres}:{data:Games[],genres:Genres[]}){
 
  const Params=useSearchParams()
      const path=usePathname()
      const router=useRouter()
  const [index, setIndex] = useState(0);
const [dataGames, setDataGames] = useState(data);

// Resetear la página cuando cambia el dataset
useEffect(() => {
  setIndex(0);
  setDataGames(data)
}, [data]);

// Dividir los juegos en páginas de 9
const dataSlice = useMemo(() => {
  let start = 0;
  let end = 9;
  const newData = [];

  for (let i = 0; i < dataGames.length / 9; i++) {
    newData.push(dataGames.slice(start, end));
    start += 9;
    end += 9;
  }

  return newData;
}, [dataGames]);

// Página actual
const games = useMemo(() => dataSlice[index], [index, dataSlice]);
      const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
      const [selectedKeysGenre, setSelectedKeysGenre] = React.useState<Selection>(new Set([]));

      

 function nextPage() {
  setIndex((prev) => {
    const newIndex = prev + 1;
    return newIndex;
  });
}

function previousPage() {
  setIndex((prev) => {
    const newIndex = prev - 1;
    return newIndex;
  });
}
function setPage(number:number){
  setIndex((prev)=>{
    const newIndex=number
    return newIndex
  })
}

    return <main className="p-5">
        <div className="flex justify-between">
        <p className="text-4xl mb-6 uppercase ">Games</p>
        <div>
        <p className="text-2xl   "></p>
 
  

        </div>


        </div>
        <div className="grid grid-cols-5 gap-5">
            <div className="col-start-1 col-end-5 grid grid-cols-3 gap-5 place-items-end">
                 {games.map((game)=>(
                    <ProductCart game={game} key={game.id}></ProductCart>
                ))}
            </div>
               <span>
        <h2 className="uppercase">Sort by:</h2>
       <Listbox
  disallowEmptySelection
  aria-label="Single selection example"
  selectedKeys={selectedKeys}
  selectionMode="single"
  variant="flat"
  onSelectionChange={setSelectedKeys}
>
  <ListboxItem
    key="release"
    onClick={() => {
      const  sort= [...dataGames].sort(
        (a, b) => new Date(b.release_at).getTime() - new Date(a.release_at).getTime()
      );
      setDataGames(sort)
    }}
  >
    Release Date
  </ListboxItem>

  <ListboxItem
    key="price"
    onClick={() => {
     const  sort=  [...dataGames].sort((a, b) => Number(b.price) - Number(a.price));
     setDataGames(sort)
    }}
  >
    Price
  </ListboxItem>

  <ListboxItem
    key="metacritic"
    onClick={() => {
       const sort= [...dataGames].sort((a, b) => Number(b.metacritic) - Number(a.metacritic));
      setDataGames(sort)
    
      }}
  >
    Metacritic Rate
  </ListboxItem>
       <ListboxItem
    key="A-Z"
    onClick={() => {
     const sort= [...dataGames].sort((a, b) =>  {
        if (a.title>b.title){
          return 1
        }
        if(a.title<b.title){
          return -1
        }
        return 0
      });
      setDataGames(sort)
    }}
    
  >
    A-Z
  </ListboxItem>
     <ListboxItem
    key="Z-A"
    onClick={() => {
       const sort=[...dataGames].sort((a, b) =>  {
        if (a.title>b.title){
          return -1
        }
        if(a.title<b.title){
          return 1
        }
        return 0
      });
      setDataGames(sort)
    }}
  >
    Z-A
  </ListboxItem>

</Listbox>
SORT BY GENRE
<Listbox   
  aria-label="Genre selection"
  selectedKeys={selectedKeysGenre}
  selectionMode="single"
  variant="flat"
 
  onSelectionChange={(keys)=>{
    
   setSelectedKeysGenre(keys)
       const selectedKey = Array.from(keys)[0];

       const genre = genres.find((g) => g.id === selectedKey);
     if (!genre) return router.replace(`${path}`);

    const param = new URLSearchParams(Params.toString());
    param.set("genre", genre.id.toString());

    router.replace(`${path}?${param.toString()}`);
  }}>
    {genres.map((genre)=>(
    <ListboxItem   key={genre.id}>
        {genre.name}
    </ListboxItem>
  ))}
</Listbox>

               </span>
                
        </div>
        <div className="flex justify-center mt-5">
          <Pagination setPage={setPage} index={index} nextPage={nextPage} previousPage={previousPage} listGames={data}></Pagination>
         

        </div>
    </main>
}