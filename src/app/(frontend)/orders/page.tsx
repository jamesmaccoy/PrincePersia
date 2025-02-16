import { getPayload, Where } from 'payload'
import config from '@payload-config'
import React from 'react'
import { Post, User } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import PageClient from './page.client'
import OrderCard from '@/components/Orders/OrderCard'
import { redirect } from 'next/navigation'

export default async function Orders() {
  const currentUser = await getMeUser()

  if (!currentUser) {
    redirect('/login')
  }

  const [upcomingOrders, pastOrders] = await Promise.all([
    getOrders('upcoming', currentUser.user),
    getOrders('past', currentUser.user),
  ])

  const formattedUpcomingOrders = upcomingOrders.docs.map((order) => ({
    ...(order.post as Pick<Post, 'meta' | 'slug' | 'title'>),
    fromDate: order.fromDate,
    toDate: order.toDate,
    guests: order.guests,
    id: order.id,
  }))

  const formattedPastOrders = pastOrders.docs.map((order) => ({
    ...(order.post as Pick<Post, 'meta' | 'slug' | 'title'>),
    fromDate: order.fromDate,
    toDate: order.toDate,
    guests: order.guests,
    id: order.id,
  }))

  console.log(upcomingOrders, pastOrders)

  return (
    <>
      <PageClient />
      <div className="my-10 container space-y-10">
        <div>
          {upcomingOrders.docs.length > 0 && (
            <h2 className="text-4xl font-medium tracking-tighter my-6">Upcoming stays</h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {formattedUpcomingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        {pastOrders.docs.length > 0 && (
          <h2 className="text-4xl font-medium tracking-tighter my-6">Past stays</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {formattedPastOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </>
  )
}

const getOrders = async (type: 'upcoming' | 'past', currentUser: User) => {
  const payload = await getPayload({ config })

  let whereQuery: Where

  if (type === 'upcoming') {
    whereQuery = {
      and: [
        {
          fromDate: {
            greater_than_equal: new Date(),
          },
        },
        {
          customer: {
            equals: currentUser.id,
          },
        },
      ],
    }
  } else {
    whereQuery = {
      and: [
        {
          fromDate: {
            less_than: new Date(),
          },
        },
        {
          customer: {
            equals: currentUser.id,
          },
        },
      ],
    }
  }

  const orders = await payload.find({
    collection: 'orders',
    limit: 100,
    where: whereQuery,
    depth: 2,
    sort: '-fromDate',
    select: {
      slug: true,
      post: true,
      guests: true,
      fromDate: true,
      toDate: true,
    },
  })

  return orders
}
