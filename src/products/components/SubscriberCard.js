import Link from "next/link";

export default function SubscriberCard() {
  return (
    <section>
      <div>
        <h4>See All Products</h4>
        <p style={{fontSize: '1rem', margin: '20px 0'}} className="">
          Go back to see the entire catalogue.
        </p>
        <Link href="/products" className="primary button"> 
          Back to products
        </Link>
      </div>
    </section>
  )
}
