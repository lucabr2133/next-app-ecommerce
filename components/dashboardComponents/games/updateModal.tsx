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
} from "@heroui/react";
import { SetStateAction, useState } from "react";

import { Games } from "@/types/database";

const EDITABLE_FIELDS: (keyof Games)[] = [
  "title",
  "price",
  "description",
  "stock",
  "updated_at",
  "metacritic",
];

function formatFieldDefaultValue(field: keyof Games, value: unknown): string {
  if (field === "updated_at" && value) {
    const d = new Date(String(value));

    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  }

  return value !== undefined && value !== null ? String(value) : "";
}

export function UpdateModal({
  game,
  onOpenChange,
  isOpen,
  setGames,
}: {
  game: Games;
  onOpenChange: () => void;
  isOpen: boolean;
  setGames: React.Dispatch<SetStateAction<Games[]>> | null;
}) {
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch(`/api/games/${game.id}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();

      if (!data?.success) {
        setErrors(data?.errors || {});
      }
      if (data?.game && setGames != null) {
        setGames((prev) =>
          prev.map((g) => (g.id === data.game.id ? { ...data.game } : g))
        );
        addToast({
          title: "Game updated successfully",
          color: "success",
          variant: "flat",
        });
        onOpenChange();
      }
      if (data?.error) {
        addToast({
          title: data.error || "Failed to update the game",
          color: "danger",
          variant: "flat",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="min-w-1/3">
        {() => (
          <>
            <ModalHeader>Update Game</ModalHeader>
            <ModalBody className="pb-6">
              <Form
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                validationErrors={errors}
                onSubmit={onHandleSubmit}
              >
                {EDITABLE_FIELDS.map((gameField) => (
                  <Input
                    key={String(gameField)}
                    isRequired
                    defaultValue={formatFieldDefaultValue(
                      gameField,
                      game[gameField]
                    )}
                    label={
                      String(gameField).charAt(0).toUpperCase() +
                      String(gameField).slice(1).replace("_", " ")
                    }
                    name={String(gameField)}
                    placeholder={String(gameField)}
                    type={gameField === "updated_at" ? "date" : "text"}
                  />
                ))}
                <div className="col-span-1 sm:col-span-2">
                  <Input
                    label="New Cover Image (optional)"
                    name="file"
                    type="file"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 flex justify-end">
                  <Button
                    color="warning"
                    isLoading={submitting}
                    type="submit"
                    variant="flat"
                  >
                    Update
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
