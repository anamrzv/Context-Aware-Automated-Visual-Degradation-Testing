<template>
  <section>
    <div class="page-header">
      <h1>User Profile</h1>
      <p class="subtitle">
        Static dashboard – info panels, order history, wishlist, settings.
      </p>
    </div>
    <div class="profile-header">
      <img
        class="avatar"
        src="https://placehold.co/150x150?text=Avatar"
        alt="User avatar"
      />
      <div class="flex column" style="gap: 0.6rem">
        <h2 style="margin: 0">Alex Doe</h2>
        <div class="flex" style="gap: 0.5rem; flex-wrap: wrap">
          <span class="badge badge-new">Member</span>
          <span class="badge badge-sale">Trial</span>
        </div>
      </div>
    </div>
    <div class="section-tight">
      <div class="profile-grid">
        <div class="info-card">
          <h3>Account</h3>
          
        </div>
        <div class="info-card">
          <h3>Loyalty</h3>
          <div class="progress">
            <div class="progress-bar" style="width: 55%"></div>
          </div>
          <span style="font-size: 0.6rem">550 / 1000 pts</span>
        </div>
        <div class="info-card">
          <h3>Notifications</h3>
          <p style="font-size: 0.6rem">Email & push preferences (static).</p>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap">
            <span class="badge badge-new">Email</span
            ><span class="badge">SMS</span
            ><span class="badge badge-sale">Push</span>
          </div>
        </div>
        <div class="info-card">
          <h3>Avatars</h3>
          <div style="display: flex">
            <img
              style="
                width: 34px;
                height: 34px;
                border-radius: 50%;
                margin-right: 4px;
              "
              src="https://placehold.co/60x60?text=A1"
              alt="A1"
            /><img
              style="
                width: 34px;
                height: 34px;
                border-radius: 50%;
                margin-right: 4px;
              "
              src="https://placehold.co/60x60?text=A2"
              alt="A2"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="component-header">
        <h2>Order History</h2>
        <div class="actions">
          <button class="button button-small">All</button
          ><button class="button button-small button-ghost">Filter</button>
        </div>
      </div>
      <div class="flow-zone">
        <div class="order-card">
          <strong style="font-size: 0.75rem">Order #ERROR</strong>
          <span style="font-size: 0.6rem" class="text-soft"
            >Placed: 2025-11-12</span
          >
          <div style="font-size: 0.6rem">Status: Packed</div>
          <button class="button button-small mt-s">Details</button>
        </div>
        <div class="order-card">
          <strong style="font-size: 0.75rem">Order #8401</strong>
          <span style="font-size: 0.6rem" class="text-soft"
            >Placed: 2025-11-01</span
          >
          <div style="font-size: 0.6rem">Status: Shipped</div>
          <button class="button button-small mt-s">Details</button>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="component-header">
        <h2>Wishlist</h2>
        <div class="actions">
          <button class="button button-small button-ghost">Manage</button>
        </div>
      </div>
      <div class="wishlist-grid">
        <div class="wishlist-item">
          <img src="/images/products/product4.png" alt="Wishlist 4" /><span
            style="font-size: 0.6rem"
            >Tech Joggers</span
          >
        </div>
        <div class="wishlist-item">
          <img src="/images/products/product5.png" alt="Wishlist 5" /><span
            style="font-size: 0.6rem"
            >Suit</span
          >
        </div>
        <div class="wishlist-item">
          <img src="/images/products/product6.png" alt="Wishlist 6" /><span
            style="font-size: 0.6rem"
            >Summer Dress</span
          >
        </div>
      </div>
    </div>
    <div class="section">
      <div class="component-header">
        <h2>Settings</h2>
        <div class="actions">
          <button class="button button-small">Save</button>
        </div>
      </div>
      <div class="profile-grid">
        <form class="info-card" aria-label="Profile form">
          <h3 style="margin: 0">Profile Info</h3>
          <div class="form-row mt-s">
            <div>
              <span class="label">Display Name</span
              ><input class="input" value="Alex Doe" />
            </div>
            <div>
              <span class="label">Email</span
              ><input class="input" value="alex@example.com" />
            </div>
            <div>
              <span class="label">Locale</span
              ><select class="select">
                <option>en-DE</option>
              </select>
            </div>
            <div>
              <span class="label">Timezone</span
              ><select class="select">
                <option>UTC+1</option>
              </select>
            </div>
          </div>
          <div class="inline-area mt-s">
            <div class="switch is-on" aria-label="Marketing toggle"></div>
            <span style="font-size: 0.6rem">Marketing Emails</span>
          </div>
          <div class="inline-area">
            <div class="switch" aria-label="Dark mode"></div>
            <span style="font-size: 0.6rem">Dark Mode</span>
          </div>
        </form>
        <form class="info-card" aria-label="Security form">
          <h3 style="margin: 0">Security</h3>
          <div class="form-row mt-s">
            <div>
              <span class="label">Password</span
              ><input class="input" type="password" value="********" />
            </div>
            <div>
              <span class="label">2FA</span
              ><select class="select">
                <option>Disabled</option>
                <option>SMS</option>
              </select>
            </div>
          </div>
          <div class="inline-form mt-s">
            <input class="input" placeholder="Recovery code" /><button
              class="button button-small button-outline"
            >
              Generate
            </button>
          </div>
          <div class="inline-note">Static controls.</div>
        </form>
        <div class="info-card" aria-label="Theme preview">
          <h3 style="margin: 0">Theme Samples</h3>
          <div class="theme-board mt-s">
            <div class="theme-tile">
              <strong style="font-size: 0.6rem">Light</strong>
              <div class="swatch-row">
                <div class="swatch"></div>
                <div
                  class="swatch"
                  style="background: var(--color-surface-alt)"
                ></div>
              </div>
            </div>
            <div class="theme-tile">
              <strong style="font-size: 0.6rem">Dark</strong>
              <div class="swatch-row">
                <div class="swatch" style="background: #5a8dff"></div>
                <div class="swatch" style="background: #252e3c"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
// Static page; no logic.
</script>
