"use client";

import {
  Table,
  TableBody,
  TableColumn,
  TableCell,
  TableHeader,
  TableRow,
  Card,
  CardBody,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  ModalHeader,
  Image,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import { Eye, Calendar, User, CheckCircle2 } from "lucide-react";
import postgres from "postgres";
import { Suspense, useCallback, useState } from "react";

export function MainOrders({ orders }: { orders: postgres.Row[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentOrder, setCurrentOrder] = useState<postgres.Row | null>(null);
  const [currentGames, setCurrentGames] = useState<postgres.Row[] | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const renderCell = useCallback(
    (order: postgres.Row, columkey: string) => {
      const cell = order[columkey];

      switch (columkey) {
        case "id":
          return (
            <span className="font-mono text-xs text-[var(--text-primary)]">
              #{String(cell).slice(0, 8).toUpperCase()}
            </span>
          );
        case "user_id":
          return (
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {cell}
            </span>
          );
        case "status":
          return (
            <Chip
              className="capitalize text-xs"
              color={cell === "paid" ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {cell}
            </Chip>
          );
        case "created_at":
          return (
            <span className="text-xs text-[var(--text-secondary)]">
              {new Date(cell).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        case "username":
          return (
            <span className="font-semibold text-sm text-[var(--text-primary)]">
              {cell}
            </span>
          );
        case "action":
          return (
            <Button
              className="rounded-lg text-xs font-medium border border-[var(--border-color)] bg-[var(--surface-1)] text-[var(--text-primary)]"
              size="sm"
              startContent={<Eye className="w-3.5 h-3.5" />}
              variant="flat"
              onPress={async () => {
                setCurrentOrder(order);
                setCurrentGames(null);
                setIsLoadingDetails(true);
                onOpen();
                const gamesOrder = await fetch(
                  `/api/checkout/success?orderId=${order?.id}`,
                  {
                    credentials: "include",
                  }
                );
                const dataGames = await gamesOrder.json();

                if (dataGames?.error || !Array.isArray(dataGames)) {
                  setCurrentGames([]);
                } else {
                  setCurrentGames(dataGames);
                }
                setIsLoadingDetails(false);
              }}
            >
              Inspect
            </Button>
          );
      }
    },
    [onOpen]
  );

  const keys =
    orders.length > 0
      ? Object.keys(orders[0])
      : ["id", "username", "status", "created_at"];

  if (!keys.includes("action")) {
    keys.push("action");
  }

  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center">
          <Spinner color="default" size="lg" />
        </div>
      }
    >
      <div className="w-full flex flex-col gap-8">
        <header className="pb-6 border-b border-[var(--border-color)]">
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">
            Transactions
          </p>
          <h1 className="font-extrabold text-3xl text-[var(--text-primary)] tracking-tight">
            Orders Management
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Inspect customer purchases, payment statuses, and issued activation keys.
          </p>
        </header>

        <div className="w-full bg-[var(--surface-2)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
          <Table
            removeWrapper
            aria-label="Orders Table"
            className="w-full"
            classNames={{
              th: "bg-[var(--surface-3)] text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider h-11",
              td: "py-4 border-b border-[var(--border-color)] last:border-b-0",
            }}
          >
            <TableHeader>
              {keys.map((key) => (
                <TableColumn key={key}>{key.replace("_", " ")}</TableColumn>
              ))}
            </TableHeader>

            <TableBody emptyContent={"No orders found"} items={orders}>
              {(item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-[var(--surface-3)]/40 transition-colors"
                >
                  {(columnKey) => (
                    <TableCell>{renderCell(item, String(columnKey))}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Modal
          backdrop="blur"
          classNames={{
            base: "bg-[var(--surface-2)] border border-[var(--border-color)]",
            header: "border-b border-[var(--border-color)]",
            footer: "border-t border-[var(--border-color)]",
          }}
          isOpen={isOpen}
          scrollBehavior="inside"
          onClose={() => {
            setCurrentOrder(null);
            setCurrentGames(null);
          }}
          onOpenChange={onOpenChange}
        >
          <ModalContent className="sm:max-w-[640px]">
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1 p-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">
                      Order Receipt
                    </h3>
                    <Chip
                      className="capitalize ml-2"
                      color={
                        currentOrder?.status === "paid" ? "success" : "warning"
                      }
                      size="sm"
                      variant="flat"
                    >
                      {currentOrder?.status}
                    </Chip>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-xs text-[var(--text-secondary)]">
                    <span className="font-mono">ID: #{currentOrder?.id}</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {currentOrder?.created_at
                          ? new Date(currentOrder.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{currentOrder?.username}</span>
                    </div>
                  </div>
                </ModalHeader>

                <ModalBody className="p-6">
                  <h4 className="font-semibold text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">
                    Purchased Items
                  </h4>
                  {isLoadingDetails ? (
                    <div className="flex justify-center py-10">
                      <Spinner color="default" />
                    </div>
                  ) : currentGames?.length === 0 ? (
                    <p className="text-[var(--text-secondary)] text-sm text-center py-4">
                      No items found for this order.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {currentGames?.map((game, idx) => (
                        <Card
                          key={game.id || idx}
                          className="bg-[var(--surface-1)] shadow-none border border-[var(--border-color)]"
                        >
                          <CardBody className="p-3.5 flex flex-row gap-4 items-center">
                            <Image
                              alt={game.title}
                              className="object-cover w-16 h-16 rounded-lg"
                              src={game.img_url}
                            />
                            <div className="flex flex-col flex-1 justify-between h-full">
                              <div className="flex justify-between items-start w-full">
                                <h2 className="font-bold text-sm text-[var(--text-primary)]">
                                  {game.title}
                                </h2>
                                <span className="font-bold text-sm text-[var(--text-primary)]">
                                  ${Number(game.price).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--border-color)]">
                                <span className="text-xs text-[var(--text-secondary)]">
                                  Activation Key
                                </span>
                                <Chip
                                  color="success"
                                  size="sm"
                                  startContent={
                                    <CheckCircle2 className="w-3 h-3 ml-1" />
                                  }
                                  variant="flat"
                                >
                                  <span className="font-mono text-xs">
                                    {game.code_key || "N/A"}
                                  </span>
                                </Chip>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </ModalBody>

                <ModalFooter className="p-6 flex justify-between items-center">
                  <span className="text-[var(--text-secondary)] text-xs">
                    Verified transaction
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                      Total
                    </span>
                    <span className="text-xl font-extrabold text-[var(--text-primary)]">
                      $
                      {currentGames
                        ?.reduce(
                          (prev, current) => prev + parseFloat(current.price),
                          0
                        )
                        .toFixed(2) || "0.00"}
                    </span>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </Suspense>
  );
}
