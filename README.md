# Acme Marketplace Demo App

This app is a marketplace where:
- Consumers can purchase individual items using the Stripe checkout flow.  
- Merchants can register to be presented in the store front
- Merchants can create a Stripe Connected Stripe account
- Merchants can create products to be sold on the marketplace


## Understanding

This project was stood up over the course of a couple of days with only a few hours per day to work on it.  There are several lacking areas that need to be addressed.
- Tests were not written due to the severe time constraints
- Proper route protection was not added due to the time constraint (e.g. all users can see all stores and manage all stores)
- Form validation was not added due to time constraints as well as proper disabling of buttons to prevent inadvertent actions.
- NextJS was used only because I my machine was already setup for node and would help expedite the build out of this demo
- The application is using a Stripe Account that is not fully onboarded...thus the ability to create onboarding links via the sdk is failing.  I have manually onboarded a connected account using the Stripe web interface.
- The application uses MySQL as a data store but due to time constraints I did not create a dockerfile and initialize a MySQL container for local development

## Data Model

The following are the high level entities that are used in the system

- Users: User are created once an individual has signed on using their Github account and are onboarded using Clerk
- Stores: Stores belong to a user and can have multiple products and a single account
- Account: Represent a Stripe Connected Account
- Product: An item that has been added to a particular Stripe Connected Account and can be sold through the storefront
- Event: A webhook event that is sent from Stripe via webhooks

## Where can I find this demo running?

A live hosted demo can be found [here](https://create.t3.gg/en/deployment/vercel).