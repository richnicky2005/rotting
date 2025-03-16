import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "medication" model, go to https://rot.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "QOEtI5s8gXAu",
  comment:
    "This model represents a medication prescribed to a user, storing details about the medication name, dosage, and frequency of intake.",
  fields: {
    dosage: {
      type: "string",
      validations: { required: true },
      storageKey: "D3XpgUFqaD3h",
    },
    medication: {
      type: "string",
      validations: { required: true },
      storageKey: "zw0zUhoHlHPt",
    },
    timesPerDay: {
      type: "number",
      decimals: 0,
      validations: { required: true },
      storageKey: "vzl7-p080HBS",
    },
    timesToTake: {
      type: "string",
      validations: { required: true },
      storageKey: "o2W_v050jBaD",
    },
    user: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "xEtecWtNVw9d",
    },
  },
};
