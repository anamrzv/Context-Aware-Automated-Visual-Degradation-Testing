<template>
  <section>
    <div class="page-header"><h1>Shopping Cart</h1></div>
    <div class="cart-grid">
      <div>
        <table class="table" aria-describedby="cart-desc">
          <caption id="cart-desc" class="sr-only">
            Static list of cart items
          </caption>
          <thead>
            <tr>
              <th>Item</th>
              <th>Details</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.id" class="line-item">
              <td style="width: 120px">
                <img :src="item.image" :alt="item.title" />
              </td>
              <td style="font-size: 0.65rem">
                <strong>{{ item.title }}</strong
                ><br /><span class="badge" v-if="item.id === 1">Sale</span>
              </td>
              <td>
                <div class="inline-area">
                  <button class="button button-small button-ghost" disabled>
                    −</button
                  ><span style="font-size: 0.75rem">{{ item.qty }}</span
                  ><button class="button button-small button-ghost" disabled>
                    +
                  </button>
                </div>
              </td>
              <td>€{{ item.price }}</td>
              <td>€{{ item.price * item.qty }}</td>
            </tr>
          </tbody>
        </table>
        <div class="mt promo-input">
          <input class="input" placeholder="Promo code" /><button
            class="button button-small"
          >
            Apply
          </button>
        </div>
        <div class="mt form-pane">
          <h3>Shipping Address</h3>
          <div class="form-row">
            <div>
              <span class="label">First Name</span><input class="input" />
            </div>
            <div>
              <span class="label">Last Name</span><input class="input" />
            </div>
            <div><span class="label">Email</span><input class="input" /></div>
            <div><span class="label">Phone</span><input class="input" /></div>
            <div><span class="label">Address</span><input class="input" /></div>
            <div><span class="label">City</span><input class="input" /></div>
            <div>
              <span class="label">Postal Code</span><input class="input" />
            </div>
            <div>
              <span class="label">Country</span
              ><select class="select">
                <option>DE</option>
                <option>FR</option>
                <option>ES</option>
              </select>
            </div>
          </div>
          <div class="inline-area">
            <div class="switch" aria-label="Save address"></div>
            <span class="text-faint" style="font-size: 0.65rem"
              >Remember address</span
            >
          </div>
        </div>
      </div>
      <aside class="sticky-panel" style="height: max-content">
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="divider"></div>
          <div class="row">
            <span>Subtotal</span><strong>€{{ subtotal }}</strong>
          </div>
          <div class="row"><span>Shipping</span><strong>€5</strong></div>
          <div class="row"><span>Taxes</span><strong>€0</strong></div>
          <div class="divider"></div>
          <div class="row total">
            <span>Total</span><strong>€{{ subtotal + 5 }}</strong>
          </div>
          <button class="button button-large" style="margin-top: 0.75rem">
            Checkout
          </button>
          <span class="note">Static preview — checkout disabled.</span>
        </div>
      </aside>
    </div>
  </section>
</template>
<script setup>
import { cartItems } from "../data/cartItems.js";
const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
</script>
