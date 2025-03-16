import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://rot.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "EoDE6YiUwV-x",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "5MNWFRTZHI_g",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "G1XgiDenNwNs",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "uUofGRdHVvNA",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "s_27yiB1KIc9",
    },
    firstName: { type: "string", storageKey: "OyhTw-KAvlGl" },
    googleImageUrl: { type: "url", storageKey: "I8h4eDF9ZJpq" },
    googleProfileId: { type: "string", storageKey: "O7S-QmMJ1hiS" },
    lastName: { type: "string", storageKey: "mO1zPYzDryEm" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "sffKaC6sSgGA",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "-TNsNNtRqdkJ",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "eWxN84Nij16H",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "rBNfEmfNPlH5",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "fZbHGnxgeizR",
    },
  },
};
