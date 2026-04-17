import { useCallback, useState } from "react";
import { formatDateInputValue } from "../utils/formatters";

const createInitialOrderForm = () => ({
  toolListId: "1",
  deliveryDate: formatDateInputValue(),
});

export const useOrderRequestForm = () => {
  const [orderForm, setOrderForm] = useState(createInitialOrderForm);

  const updateOrderFormField = useCallback((field, value) => {
    setOrderForm((current) => ({ ...current, [field]: value }));
  }, []);

  const resetOrderForm = useCallback(() => {
    setOrderForm(createInitialOrderForm());
  }, []);

  const resetOrderDeliveryDate = useCallback(() => {
    setOrderForm((current) => ({
      ...current,
      deliveryDate: formatDateInputValue(),
    }));
  }, []);

  return {
    orderForm,
    setOrderForm,
    updateOrderFormField,
    resetOrderForm,
    resetOrderDeliveryDate,
  };
};

export default useOrderRequestForm;
