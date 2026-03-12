"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, Cookie } from "lucide-react";

const docs = [
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal data.",
    icon: Shield,
    iubendaId: "iubenda-pp",
  },
  {
    title: "Terms & Conditions",
    description: "Terms of use for the ArtlyPet platform and services.",
    icon: FileText,
    iubendaId: "iubenda-terms",
  },
  {
    title: "Cookie Policy",
    description: "Information about cookies and tracking technologies.",
    icon: Cookie,
    iubendaId: "iubenda-cookie",
  },
];

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Legal
          </h1>
          <p className="text-muted-foreground mb-12">
            Our legal documents, powered by Iubenda for GDPR and international compliance.
          </p>

          <div className="space-y-6 mb-12">
            {docs.map((doc, i) => (
              <motion.div
                key={doc.iubendaId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <doc.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-serif text-xl font-bold mb-1">{doc.title}</h2>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                    {/* Iubenda embed placeholder */}
                    <div
                      id={doc.iubendaId}
                      className="min-h-[200px] rounded-xl bg-muted/50 flex items-center justify-center text-sm text-muted-foreground"
                    >
                      Iubenda document will be embedded here once configured.
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Legal documents are generated and managed by Iubenda.</p>
            <p className="mt-1">For questions, contact us at support@artlypet.com</p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
