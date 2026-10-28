"use client";

import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Games } from "@/types/database";
import { ProductCart } from "@/components/globalComponents/Card";

export default function MainGamesAdmin({ games }: { games: Games[] }) {
  const [gamesState, setGames] = useState<Games[]>(games);
  const itemsPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setloading] = useState(false);
  const pages = Math.ceil(gamesState.length / itemsPage);

  const gamesPage = useMemo(() => {
    return gamesState.slice((currentPage - 1) * 9, 9 * currentPage);
  }, [currentPage, gamesState]);

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const values = [
    "title",
    "price",
    "description",
    "company_id",
    "release_at",
    "stock",
    "updated_at",
    "metacritic",
  ];
  const [errors, setErrors] = useState({});

  async function onHandleCreateGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setloading(true);
    try {
      const formdata = new FormData(e.currentTarget);
      const res = await fetch(`/api/games`, {
        method: "POST",
        body: formdata,
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        setErrors(data?.errors?.fieldErrors || {});
      }
      if (data?.game) {
        setGames([data.game, ...gamesState]);
        setErrors({});
        onClose();
        addToast({
          title: "Game created successfully",
          variant: "flat",
          color: "success",
        });
      } else {
        addToast({
          title: data?.error || "Failed to create game",
          variant: "flat",
          color: "danger",
        });
      }
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
            Inventory
          </p>
          <h1 className="font-extrabold text-3xl text-[var(--text-primary)] tracking-tight">
            Games Catalog
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Create, update, or remove digital titles from the storefront.
          </p>
        </div>
        <Button
          className="rounded-xl font-semibold text-xs bg-[var(--text-primary)] text-[var(--surface-1)]"
          size="md"
          startContent={<Plus className="w-4 h-4" />}
          onPress={onOpen}
        >
          New Title
        </Button>
      </header>

      <Modal
        backdrop="blur"
        classNames={{
          base: "bg-[var(--surface-2)] border border-[var(--border-color)]",
          header: "border-b border-[var(--border-color)]",
          footer: "border-t border-[var(--border-color)]",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="sm:max-w-[600px]">
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="font-bold text-xl text-[var(--text-primary)]">
                  Add New Game
                </h3>
                <p className="text-xs font-normal text-[var(--text-secondary)]">
                  Fill in the details below to publish a title to the store.
                </p>
              </ModalHeader>
              <ModalBody className="py-6">
                <Form
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  validationErrors={errors}
                  onSubmit={onHandleCreateGame}
                >
                  {values.map((value) => (
                    <Input
                      key={value}
                      isRequired
                      label={
                        value === "company_id"
                          ? "Company Name"
                          : value.charAt(0).toUpperCase() +
                            value.slice(1).replace("_", " ")
                      }
                      name={value === "company_id" ? "company_name" : value}
                      placeholder={`Enter ${
                        value === "company_id"
                          ? "company name"
                          : value.replace("_", " ")
                      }`}
                      type={
                        value === "release_at" || value === "updated_at"
                          ? "date"
                          : "text"
                      }
                      variant="bordered"
                    />
                  ))}
                  <div className="col-span-1 md:col-span-2 mt-2">
                    <Input
                      isRequired
                      label="Cover Image"
                      name="file"
                      type="file"
                      variant="bordered"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                    <Button variant="flat" onPress={onCloseModal}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-[var(--text-primary)] text-[var(--surface-1)] font-semibold"
                      isLoading={loading}
                      type="submit"
                    >
                      Publish Game
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center py-20">
            <Spinner color="default" size="lg" />
          </div>
        ) : (
          gamesPage.map((game) => (
            <ProductCart key={game.id} game={game} setGames={setGames} />
          ))
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center w-full mt-6">
          <Pagination
            loop
            showControls
            color="default"
            page={currentPage}
            total={pages}
            variant="flat"
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
