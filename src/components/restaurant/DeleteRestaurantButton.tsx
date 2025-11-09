"use client";

import { useState } from "react";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { deleteRestaurant } from "@/actions/restaurant.actions";
import { useRouter } from "next/navigation";
import { content } from "@/content/text.content";

interface Props {
  restaurantId: string;
  restaurantName: string;
  userId: string;
}

export default function DeleteRestaurantButton({
  restaurantId,
  restaurantName,
  userId,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setLoading(true);

    const result = await deleteRestaurant(restaurantId, userId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/owner/my-restaurants");
  };

  return (
    <>
      <Button color="danger" variant="flat" onPress={onOpen}>
        {content.restaurant.delete}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} className="bg-red-600 text-white">
        <ModalContent>
          <ModalHeader>{content.restaurant.delete}</ModalHeader>
          <ModalBody>
            {error && (
              <div className="bg-danger-50 text-danger p-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}
            <p>
              {content.restaurant.deleteConfirm(restaurantName)}
            </p>
            <p className="text-sm text-danger mt-2">
              {content.restaurant.deleteWarning}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} isDisabled={loading}>
              {content.actions.cancel}
            </Button>
            <Button color="danger" onPress={handleDelete} isLoading={loading}>
              {content.actions.delete}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
