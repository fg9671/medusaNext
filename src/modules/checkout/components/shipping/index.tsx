import { RadioGroup } from "@headlessui/react"
import { ErrorMessage } from "@hookform/error-message"
import { Cart } from "@medusajs/medusa"
import Radio from "@modules/common/components/radio"
import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import { formatAmount, useCart, useCartShippingOptions } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"

type ShippingOption = {
  value: string
  label: string
  price: string
}

type ShippingProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

type ShippingFormProps = {
  soId: string
}

const Shipping: React.FC<ShippingProps> = ({ cart }) => {
  const [disabled, setDisabled] = useState(true)
  const { addShippingMethod, setCart } = useCart()
  const {
    control,
    setError,
    formState: { errors },
  } = useForm<ShippingFormProps>({
    defaultValues: {
      soId: cart.shipping_methods?.[0]?.shipping_option_id,
    },
  })

  useEffect(() => {
    setDisabled(true)

    if (!cart) {
      return
    }

    if (!cart.email) {
      return
    }

    if (!cart.shipping_address) {
      return
    }

    if (!cart.billing_address) {
      return
    }

    setDisabled(false)
  }, [cart])

  // Fetch shipping options
  const { shipping_options, refetch } = useCartShippingOptions(cart.id, {
    enabled: !!cart.id,
  })

  // Any time the cart changes we need to ensure that we are displaying valid shipping options
  useEffect(() => {
    const refetchShipping = async () => {
      await refetch()
    }

    refetchShipping()
  }, [cart, refetch])

  const submitShippingOption = (soId: string) => {
    addShippingMethod.mutate(
      { option_id: soId },
      {
        onSuccess: ({ cart }) => setCart(cart),
        onError: () =>
          setError(
            "soId",
            {
              type: "validate",
              message:
                "An error occurred while adding shipping. Please try again.",
            },
            { shouldFocus: true }
          ),
      }
    )
  }

  const handleChange = (value: string, fn: (value: string) => void) => {
    submitShippingOption(value)
    fn(value)
  }

  // Memoized shipping method options
  const shippingMethods: ShippingOption[] = useMemo(() => {
    if (shipping_options && cart?.region) {
      return shipping_options?.map((option) => ({
        value: option.id,
        label: option.name,
        price: formatAmount({ amount: option.amount, region: cart.region }),
      }))
    }

    return []
  }, [shipping_options, cart])

  return (
    <div className="p-10 bg-white">
      <h3 className="text-xl-semi mb-2">Shipping method</h3>
      <div className="mb-4">
        <span className="text-base-regular text-gray-700">
          How would you like your package to be delivered?
        </span>
      </div>
      <Controller
        name="soId"
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <div>
              <RadioGroup
                value={value}
                onChange={(value) => handleChange(value, onChange)}
                className={clsx({
                  "opacity-50": disabled,
                })}
                disabled={disabled}
              >
                {shippingMethods && shippingMethods.length ? (
                  shippingMethods.map((option) => {
                    return (
                      <RadioGroup.Option
                        key={option.value}
                        value={option.value}
                        className={clsx(
                          "flex items-center justify-between text-base-regular cursor-pointer py-8 border-b border-gray-200 last:border-b-0"
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          <Radio checked={value === option.value} />
                          <span className="text-base-semi">{option.label}</span>
                        </div>
                        <span className="justify-self-end text-gray-700">
                          {option.price}
                        </span>
                      </RadioGroup.Option>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-8 text-gray-900">
                    <Spinner />
                  </div>
                )}
              </RadioGroup>
              <ErrorMessage
                errors={errors}
                name="soId"
                render={({ message }) => {
                  return (
                    <div className="pt-2 text-rose-500 text-small-regular">
                      <span>{message}</span>
                    </div>
                  )
                }}
              />
            </div>
          )
        }}
      />
    </div>
  )
}

export default Shipping