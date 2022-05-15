import { Order } from "@medusajs/medusa"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import PaymentDetails from "@modules/order/components/payment-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderCompletedTemplateProps = {
  order: Order
}

const OrderCompletedTemplate: React.FC<OrderCompletedTemplateProps> = ({
  order,
}) => {
  return (
    <div className="bg-gray-50 flex justify-center p-10 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl h-full bg-white w-full">
        <OrderDetails order={order} />
        <Items items={order.items} region={order.region} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-10 border-b border-gray-200">
          <PaymentDetails
            payments={order.payments}
            paymentStatus={order.payment_status}
          />
          <ShippingDetails
            shippingMethods={order.shipping_methods}
            address={order.shipping_address}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-10">
          <Help />
          <OrderSummary order={order} />
        </div>
      </div>
    </div>
  )
}

export default OrderCompletedTemplate