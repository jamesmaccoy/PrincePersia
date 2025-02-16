import { type Media as MediaType, User } from '@/payload-types'
import { formatDate } from 'date-fns'
import { CalendarIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'
import { Media } from '../Media'

type Props = {
  order: {
    fromDate: string
    toDate: string
    guests: (string | User)[] | null | undefined
    id: string
    slug?: string | null | undefined
    title: string
    meta?:
      | {
          title?: string | null | undefined
          image?: string | MediaType | null | undefined
          description?: string | null | undefined
        }
      | undefined
  }
}

const OrderCard: FC<Props> = ({ order }) => {
  return (
    <Link key={order.id} href={`/admin/collections/orders/${order.id}`}>
      <div className="flex flex-col gap-4 border border-border bg-card h-full">
        <div className="relative w-full">
          {!order.meta?.image && <div>No Image</div>}
          {order.meta?.image && typeof order.meta?.image !== 'string' && (
            <Media resource={order.meta.image} size="33vw" />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-2xl font-medium">{order.title}</h3>
          <p className="my-2">{order.meta?.description}</p>
          <div
            className="flex items-center gap-2 font-medium
        "
          >
            <div>
              <CalendarIcon className="size-4" />
            </div>
            <div className="text-sm font-medium">
              {formatDate(new Date(order.fromDate), 'PPP')} -{' '}
              {formatDate(new Date(order.toDate), 'PPP')}
            </div>
          </div>
          {order.guests && order.guests?.length > 0 && (
            <div className="flex items-center gap-2">
              <div>
                <UsersIcon className="size-4" />
              </div>
              <div className="font-medium text-sm">{order.guests?.length} Guests</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default OrderCard
