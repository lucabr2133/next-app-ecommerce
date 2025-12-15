import { Games } from "@/types/database";
import { Button, Card, CardFooter, CardHeader, Link, Image, Spinner, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, addToast, useDisclosure } from "@heroui/react";
import { SetStateAction, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import {EllipsisVertical ,Pencil, XIcon } from "lucide-react";
import { CartContext } from "@/app/(main)/contex/contex";
import { UpdateModal } from "@/components/dashboardComponents/games/updateModal";

export function ShopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 
        14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218
        c1.121-2.3 2.1-4.684 2.924-7.138
        a60.114 60.114 0 0 0-16.536-1.84M7.5
        14.25 5.106 5.272M6 20.25a.75.75 0 1 
        1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 
        0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 
        1.5 0Z"
      />
    </svg>
  );
}

export function ProductCart({ game ,setGames}: { game: Games,setGames:React.Dispatch<SetStateAction<Games[]>>|null }) {
  const path=usePathname()
    const {isOpen,onOpenChange,onOpen}  =useDisclosure()

  const { cartList, setCartList } = useContext(CartContext);
  
  const [loading, setLoading] = useState(false);
  const isInCart = cartList.some((g) => g.id === game.id);
  const isPlaceholder = game.title === "See more";
const isInAdminPage=path==='/dashboard/games'
  const handleAddToCart = async () => {
    setLoading(true);
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game }),
    });
    setCartList([...cartList, game]);
    setLoading(false);
  };

  const handleRemoveFromCart = async () => {
    setLoading(true);
    await fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id }),
    });
    setCartList(cartList.filter((g) => g.id !== game.id));
    setLoading(false);
  };

  return (
    <>
    <Card
      className={`relative my-5 mx-2 w-full h-[340px] border border-amber-500/40 rounded-2xl overflow-hidden 
      shadow-[0_0_20px_rgba(255,200,50,0.15)] transition-all duration-500 hover:scale-[1.02] 
      hover:shadow-[0_0_35px_rgba(255,200,50,0.25)]`}
    >
      <div className="relative h-full w-full">
        {!isPlaceholder ? (
          <Image
            removeWrapper
            alt={game.title}
            src={game.img_url}
            className="object-cover w-full h-full brightness-90 hover:brightness-100 transition-all"
          />
        ) : (
          <Link
            href="/games"
            className="flex justify-center items-center w-full h-full text-2xl font-bold text-amber-400 hover:text-amber-300 transition-all"
          >
            See More +
          </Link>
        )}

        {!isPlaceholder && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />}

        {!isPlaceholder && (
          <CardHeader className="absolute bottom-20 left-3 z-10 flex-col items-start">
            <h3 className="text-white font-extrabold text-2xl uppercase tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {game.title}
            </h3>
          </CardHeader>
        )}
      </div>

      {!isPlaceholder && !isInAdminPage && (
        <CardFooter className="absolute bottom-0 left-0 right-0 z-20  backdrop-blur-md flex justify-between items-center px-4 py-3">
          <div className="flex gap-2">
            {loading ? (
              <Spinner size="sm" color="warning" />
            ) : isInCart ? (
              <Button
                onPress={handleRemoveFromCart}
                size="sm"
                color="danger"
                variant="shadow"
                className="flex items-center gap-1"
              >
                <ShopIcon />
                Remove
              </Button>
            ) : (
              <Button
                onPress={handleAddToCart}
                size="sm"
                color="primary"
                variant="shadow"
                className="flex items-center gap-1"
              >
                <ShopIcon />
                Add
              </Button>
            )}

            <Button
              as={Link}
              href={`/games/${game.id}`}
              size="sm"
              color="secondary"
              variant="shadow"
            >
              Details
            </Button>
          </div>

          <h2 className="text-lg font-bold text-amber-300 drop-shadow-[0_0_5px_rgba(255,200,50,0.4)]">
            ${game.price}
          </h2>
        </CardFooter>
      )}
      {isInAdminPage&&<Dropdown>
        <DropdownTrigger><Button isIconOnly color="default"  variant="flat" className="absolute top-0 right-0"><EllipsisVertical></EllipsisVertical></Button></DropdownTrigger>
     <DropdownMenu aria-label="Static Actions">
   
        <DropdownItem onPress={onOpen} startContent={<Pencil></Pencil>} key="edit" color="warning" variant="flat" >Edit Game</DropdownItem>
        <DropdownItem onPress={async()=>{
          const res=await fetch(`/api/games/${game.id}`,{
            method:'DELETE'
          })
          const data= await res.json()
          if(res?.ok && setGames){
            setGames((prev)=>{
              return prev.filter((game)=>game.id!=data?.game?.id)
            })
          }

          addToast({
            title:data?.message||data?.error,
            color:data?.message?'success':'danger',
            variant:'flat'
          })  
          
         
        }} startContent={<XIcon></XIcon>} key="delete" className="text-danger"  variant='flat' color="danger">
          Delete Game
        </DropdownItem>
      </DropdownMenu>
      </Dropdown>}
    </Card>
    <UpdateModal setGames={setGames} game={game} isOpen={isOpen} onOpenChange={onOpenChange}></UpdateModal>
    </>

  );
}
