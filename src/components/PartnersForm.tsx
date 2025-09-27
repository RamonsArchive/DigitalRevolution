"use client";
import React, { useRef } from "react";
import { useActionState } from "react";
import { ActionState } from "@/lib/globalTypes";
import { animateTextScroll, parseServerActionResponse } from "@/lib/utils";
import { verifyPartnersForm } from "@/lib/validation";
import Form from "next/form";
import { useState } from "react";
import { updatePhoneNumber, formToDataObject } from "@/lib/utils";
import { submitPartnersForm } from "@/lib/actions";
import { toast } from "sonner";
import { z } from "zod";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, SplitText);

const PartnersForm = ({ formTitle }: { formTitle: string }) => {
  const accentDividerRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const formTitleRef = useRef<HTMLHeadingElement>(null);

  const firstNameLabelRef = useRef<HTMLLabelElement>(null);
  const lastNameLabelRef = useRef<HTMLLabelElement>(null);
  const emailLabelRef = useRef<HTMLLabelElement>(null);
  const phoneNumberLabelRef = useRef<HTMLLabelElement>(null);
  const organizationLabelRef = useRef<HTMLLabelElement>(null);
  const messageLabelRef = useRef<HTMLLabelElement>(null);

  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneNumberInputRef = useRef<HTMLInputElement>(null);
  const organizationInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    phoneNumber: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    organization?: string;
    message?: string;
  }>({});
  const [phoneNumber, setPhoneNumber] = useState("");

  useGSAP(() => {
    const initAnimations = () => {
      if (
        !formTitleRef.current ||
        !accentDividerRef.current ||
        !firstNameLabelRef.current ||
        !lastNameLabelRef.current ||
        !emailLabelRef.current ||
        !phoneNumberLabelRef.current ||
        !organizationLabelRef.current ||
        !messageLabelRef.current ||
        !firstNameInputRef.current ||
        !lastNameInputRef.current ||
        !emailInputRef.current ||
        !phoneNumberInputRef.current ||
        !organizationInputRef.current ||
        !messageInputRef.current ||
        !submitButtonRef.current
      ) {
        setTimeout(initAnimations, 100);
        return;
      }

      // title splits
      const formTitleSplit = new SplitText(formTitleRef.current, {
        type: "words",
      });
      // label splits
      const firstNameLabelSplit = new SplitText(firstNameLabelRef.current, {
        type: "words",
      });
      const lastNameLabelSplit = new SplitText(lastNameLabelRef.current, {
        type: "words",
      });
      const emailLabelSplit = new SplitText(emailLabelRef.current, {
        type: "words",
      });
      const phoneNumberLabelSplit = new SplitText(phoneNumberLabelRef.current, {
        type: "words",
      });

      const organizationLabelSplit = new SplitText(
        organizationLabelRef.current,
        {
          type: "words",
        }
      );
      const messageLabelSplit = new SplitText(messageLabelRef.current, {
        type: "words",
      });

      gsap.set(
        [
          ...formTitleSplit.words,
          ...firstNameLabelSplit.words,
          ...lastNameLabelSplit.words,
          ...emailLabelSplit.words,
          ...phoneNumberLabelSplit.words,
          ...organizationLabelSplit.words,
          ...messageLabelSplit.words,
        ],
        {
          opacity: 0,
          y: 100,
        }
      );

      gsap.set(
        [
          firstNameInputRef.current,
          lastNameInputRef.current,
          emailInputRef.current,
          phoneNumberInputRef.current,
          organizationInputRef.current,
          messageInputRef.current,
          accentDividerRef.current,
          submitButtonRef.current,
        ],
        {
          opacity: 0,
          y: 100,
        }
      );

      const allTextElements = [...formTitleSplit.words];

      gsap.to(allTextElements, {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#contact-form",
          start: "top 90%",
          end: "bottom 30%",
          scrub: 0.03,
        },
      });

      const allLabels = [
        ...firstNameLabelSplit.words,
        ...lastNameLabelSplit.words,
        ...emailLabelSplit.words,
        ...phoneNumberLabelSplit.words,
        ...organizationLabelSplit.words,
        ...messageLabelSplit.words,
      ];

      gsap.to(allLabels, {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#contact-form",
          start: "top 90%",
          end: "bottom 30%",
          scrub: 0.03,
        },
      });

      const allInputs = [
        firstNameInputRef.current,
        lastNameInputRef.current,
        emailInputRef.current,
        phoneNumberInputRef.current,
        organizationInputRef.current,
        messageInputRef.current,
      ];

      gsap.to(allInputs, {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#contact-form",
          start: "top 90%",
          end: "bottom 30%",
          scrub: 0.03,
        },
      });

      const remainingElements = [
        accentDividerRef.current,
        submitButtonRef.current,
      ];

      gsap.to(remainingElements, {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#contact-form",
          start: "top 90%",
          end: "bottom 30%",
          scrub: 0.03,
        },
      });

      return () => {
        formTitleSplit.revert();
        firstNameLabelSplit.revert();
        lastNameLabelSplit.revert();
        emailLabelSplit.revert();
        phoneNumberLabelSplit.revert();
        organizationLabelSplit.revert();
        messageLabelSplit.revert();
        ScrollTrigger.getAll().forEach((trigger) => {
          trigger.kill();
        });
      };
    };

    initAnimations();
  }, [
    firstNameLabelRef.current,
    lastNameLabelRef.current,
    emailLabelRef.current,
    phoneNumberLabelRef.current,
    organizationLabelRef.current,
    messageLabelRef.current,
    firstNameInputRef.current,
  ]);

  const handleFormChange = (key: string, value: string) => {
    if (key === "phoneNumber") {
      updatePhoneNumber(value, phoneNumber, setPhoneNumber);
      const cleanPhone = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, phoneNumber: cleanPhone });
      return;
    }

    setFormData({ ...formData, [key]: value });
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      organization: "",
      message: "",
    });
    setPhoneNumber("");
    setErrors({});
    setStatusMessage("");
  };

  const handleFromSubmit = async (
    prevState: ActionState,
    formData: FormData
  ): Promise<ActionState> => {
    try {
      setErrors({});
      const formObject = formToDataObject(formData);
      const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");
      formObject.phoneNumber = cleanPhoneNumber;

      await verifyPartnersForm.parseAsync(formObject);

      const result = await submitPartnersForm(formObject);

      if (result.status === "ERROR") {
        toast.error("ERROR", {
          description: result.error as unknown as string,
        });
        setStatusMessage("Something went wrong. Please try again.");
        return parseServerActionResponse({
          status: "ERROR",
          error: result.error as unknown as string,
          data: null,
        });
      }

      resetForm();
      setStatusMessage("Partners form submitted successfully");
      toast.success("SUCCESS", {
        description: "Partners form submitted successfully",
      });

      return parseServerActionResponse({
        status: "SUCCESS",
        error: "",
        data: null,
      });
    } catch (error) {
      console.error("Error submitting form", error);
      setStatusMessage("Something went wrong. Please try again.");
      if (error instanceof z.ZodError) {
        const fieldErrors = z.flattenError(error).fieldErrors as Record<
          string,
          string[]
        >;
        const formattedErrors: Record<string, string> = {};
        Object.keys(fieldErrors).forEach((key) => {
          formattedErrors[key] = fieldErrors[key]?.[0] || "";
        });
        toast.error("ERROR", { description: "Please fill out all fields" });
        return parseServerActionResponse({
          status: "ERROR",
          error: "Please fill out all fields",
          data: null,
        });
      }

      toast.error("ERROR", {
        description: "Something went wrong. Please try again.",
      });
      return parseServerActionResponse({
        status: "ERROR",
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        data: null,
      });
    }
  };
  const [state, formAction, isPending] = useActionState(handleFromSubmit, {
    status: "INITIAL",
    error: "",
    data: null,
  });
  return (
    <div className="flex flex-col gap-8">
      <Form
        id="contact-form"
        action={formAction}
        className="flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <label
              ref={firstNameLabelRef}
              htmlFor="firstName"
              className="text-slate-200 font-semibold text-sm"
            >
              First Name
            </label>
            <input
              ref={firstNameInputRef}
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => handleFormChange("firstName", e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm font-medium">
                {errors.firstName}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label
              ref={lastNameLabelRef}
              htmlFor="lastName"
              className="text-slate-200 font-semibold text-sm"
            >
              Last Name
            </label>
            <input
              ref={lastNameInputRef}
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => handleFormChange("lastName", e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm font-medium">
                {errors.lastName}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label
              ref={emailLabelRef}
              htmlFor="email"
              className="text-slate-200 font-semibold text-sm"
            >
              Email Address
            </label>
            <input
              ref={emailInputRef}
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-red-400 text-sm font-medium">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label
              ref={phoneNumberLabelRef}
              htmlFor="phoneNumber"
              className="text-slate-200 font-semibold text-sm"
            >
              Phone Number
            </label>
            <input
              ref={phoneNumberInputRef}
              type="text"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.phoneNumber && (
              <p className="text-red-400 text-sm font-medium">
                {errors.phoneNumber}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 md:col-span-2">
            <label
              ref={organizationLabelRef}
              htmlFor="organization"
              className="text-slate-200 font-semibold text-sm"
            >
              Organization
            </label>
            <input
              ref={organizationInputRef}
              type="text"
              name="organization"
              placeholder="Enter your organization name"
              value={formData.organization}
              onChange={(e) => handleFormChange("organization", e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.organization && (
              <p className="text-red-400 text-sm font-medium">
                {errors.organization}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 md:col-span-2">
            <label
              ref={messageLabelRef}
              htmlFor="message"
              className="text-slate-200 font-semibold text-sm"
            >
              Partnership Message
            </label>
            <textarea
              ref={messageInputRef}
              name="message"
              placeholder="Tell us about your organization and how you'd like to partner with us..."
              value={formData.message}
              onChange={(e) => handleFormChange("message", e.target.value)}
              disabled={isPending}
              rows={5}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            {errors.message && (
              <p className="text-red-400 text-sm font-medium">
                {errors.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            ref={submitButtonRef}
            className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Partnership Request...</span>
              </div>
            ) : (
              "Submit Partnership Request"
            )}
          </button>
        </div>
      </Form>

      {statusMessage && (
        <div className="flex justify-center w-full mt-4">
          <div
            className={`px-6 py-3 rounded-xl text-center max-w-md ${
              statusMessage.includes("successfully")
                ? "bg-green-900/30 border border-green-700/50 text-green-300"
                : "bg-red-900/30 border border-red-700/50 text-red-300"
            }`}
          >
            <p className="text-sm font-medium">{statusMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersForm;
