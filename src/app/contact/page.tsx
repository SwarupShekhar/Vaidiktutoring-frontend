"use client";
import React from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 bg-linear-to-b from-ice-blue to-background">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-deep-navy mb-6">
          Contact Us
        </h1>
        <p className="text-xl text-text-secondary font-medium italic">
          “Our advisors are here to help you find the right path for your
          child.”
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-8 rounded-4xl bg-white shadow-xl border border-border flex flex-col items-center group hover:scale-105 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-6">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Email</h3>
          <p className="text-text-secondary font-semibold">
            support@studyhours.com
          </p>
        </div>

        <div className="p-8 rounded-4xl bg-white shadow-xl border border-border flex flex-col items-center group hover:scale-105 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
            <MessageCircle size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
          <p className="text-text-secondary font-semibold">+1 (555) 012-3456</p>
        </div>

        <div className="p-8 rounded-4xl bg-white shadow-xl border border-border flex flex-col items-center group hover:scale-105 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
            <Phone size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Phone</h3>
          <p className="text-text-secondary font-semibold">+1 (555) 012-7890</p>
        </div>

        <div className="p-8 rounded-4xl bg-white shadow-xl border border-border flex flex-col items-center group hover:scale-105 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
            <MapPin size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Office</h3>
          <p className="text-text-secondary font-semibold text-center mt-1">
            123 Learning Lane, <br />
            Education City, EC 101
          </p>
        </div>
      </div>

      <div className="mt-20 max-w-2xl mx-auto p-12 rounded-[3rem] bg-deep-navy text-white text-center shadow-2xl">
        <h2 className="text-2xl font-black mb-4">Want a free consultation?</h2>
        <p className="text-blue-100 opacity-80 mb-8">
          Speak with our academic advisors to understand how we can help your
          child master their curriculum.
        </p>
        <a
          href="/signup?type=assessment"
          className="inline-block px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-sapphire transition-all shadow-xl shadow-blue-500/20"
        >
          Book Diagnostic Call
        </a>
      </div>
    </main>
  );
}
