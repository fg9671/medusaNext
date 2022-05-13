import { findCheapestPrice } from "@lib/util/prices"
import { Region } from "@medusajs/medusa"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Product } from "types/medusa"
import Thumbnail from "../thumbnail"

type ProductPreviewProps = {
  product: Product
  region?: Region
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ product, region }) => {
  const [price, setPrice] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (region) {
      const cheapestPrice = findCheapestPrice(product.variants, region)
      setPrice(cheapestPrice)
    }
  }, [product, region])

  return (
    <Link href={`/products/${product.handle}`} passHref>
      <a className="cursor-pointer">
        <Thumbnail
          images={product.images}
          thumbnail={product.thumbnail}
          size="full"
        />
        <div className="py-4 pr-2 text-small-regular">
          <div>{product.title}</div>
          <div className="text-gray-700">{price}</div>
        </div>
      </a>
    </Link>
  )
}

export default ProductPreview
