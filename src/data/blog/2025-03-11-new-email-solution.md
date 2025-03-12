---
title: Finding My New Email Solution
description: So, it is finally time to renew my email subscription. However, with money being tight and things not being very straightforward anymore, I want to start reconsidering what provider I will use and how I plan to set it up. There are a few key...
tags: [Personal, Email]
published: 2025-03-11
url: /2025/03/finding-my-new-email-solution
category: Thoughts
draft: false
---

So, it is finally time to renew my email subscription. However, with money being tight and things not being very straightforward anymore, I want to start reconsidering what provider I will use and how I plan to set it up. There are a few key things I need to make sure I require of an email provider, but there are some interesting options I want to explore.

**My Hard Requirements:**

<ul class="list-disc custom-list">
<li>Catch-All Domain Addresses (I heavily use this)</li>
<li>At least 25 Custom Domains</li>
<li>Have good send reputation to ensure delivery of mail</li>
</ul>

**Nice To Haves:**

<ul class="list-disc custom-list">
<li>Nice WebUI or App (otherwise I will go back to desktop email)</li>
<li>Servers in North America (I don't want to deal with international encryption law issues)</li>
</ul>

### Keep Using FastMail

So, the easiest option is to keep using FastMail, which the company has done many lovely things in the opensource community. However, they are raising their prices, and I have learned they have had some issues with their union having 60% of their members laid off. So I am just feeling like it might be time to move elsewhere. That said, I do wish to point out that they really have been a great email provider for years, and I left but came back for 3 years, but it is finally time for me to give someone else a chance.

### Proton Mail

Many point out that this provider is an excellent alternative to Google Services. However, I am not a fan of how much they charge, and I have never been a fan of the whole "encrypted email" when 90% of email is still sitting un-encrypted at rest, let alone most of it isn't even encrypted at all, just embedded HTML. I don't see the point in a provider like this when you can use PGP encryption on the emails you care about. Also, I think they are expensive for email...

### Spacemail

So, I have slowly been moving over to Spaceship (a sub-company of Namecheap), where I have been pretty happy with their re-focus on simplicity like what Namecheap used to be, before their who almost GoDaddy-like competitor shoving tons of crazy stuff at you. Their Spacemail offering looks pretty good and is cost-competitive. They offer unlimited aliases and custom domain support, which I think is a great option. They also have what looks like an excellent spam control tool, along with a nice-looking webmail application. This one feels like it can be a strong contender.

### MXRoute

I have been using this tremendous small company option for CyberFurz's email service, and they have excellent, top-notch support. They also, with EVERY plan, don't restrict anything in terms of aliases, domains, or even mailboxes! This means you just pay for the amount of storage and send tier you might need. They even offer a "Lifetime" plan for personal use that you pay once for their service. My main downside is that their webmail options are just the popular opensource email apps like RoundCube and one paid one called Crossbox, which I am not a fan of. That said, using an external email client is good enough with IMAP, and I'm happy with that.

### Cloudflare + AWS SES + GMail

So, I still have my Gmail address, and I currently have it forward mail to my other mailbox at FastMail. However, because I returned to Android recently and tried to force myself back into the less Apple side of things... I have 6 months of Google One with my phone. I use the AI service a good bit for helping me with coding problems as well as for helping me upload software documentation I have to support at work (public software like Oracle Fusion Middleware) so I can then ask it to help me debug issues. It is the most cost-to-actual-usefulness AI option out there. So I might end up paying to keep their service, but it doesn't make me feel good about it.

How it would work is that I would leverage Cloudflare's free email catch-all service to forward emails to my Gmail address, set up a Send Domain in AWS SES for me using Google Mail's Send Service, which would allow me to send using my custom domains through SES, and then, of course, store my emails in GMail.

### In Conclusion

I don't fully know what I plan to go with yet. I have about two weeks to figure it out before my FastMail comes up for renewal, so I am trying to weigh my options. I honestly feel strongest about the MXRoute Lifetime plan, which supports a small business, or the silly last option of mashing several low-cost to free things together. I would love for others to review and let me know their thoughts.

<style>
.custom-list {
    padding-left: 1.5rem; /* Provide space for the bullet */
}

.custom-list li {
    position: relative;
    padding-left: 1.5rem; /* Provide space for the bullet */
    list-style-type: none; /* Remove default bullet */
}

.custom-list li::before {
    content: "•"; /* Use bullet point */
    color: red; /* Bullet color */
    position: absolute;
    left: 0; /* Position bullet on the left */
    top: 0; /* Align bullet with text */
}
</style>
