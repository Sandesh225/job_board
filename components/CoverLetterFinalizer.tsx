"use client";

import { useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from "@react-pdf/renderer";
import { Card, Label, TextInput, Textarea, Button, Spinner } from "flowbite-react";
import { HiDownload, HiArrowRight } from "react-icons/hi";
import Link from "next/link";

// Register Font
Font.register({
  family: "Helvetica",
  fonts: [{ src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf" }]
});

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: "Helvetica", fontSize: 11, lineHeight: 1.5 },
  header: { marginBottom: 30, borderBottom: "1pt solid #000", paddingBottom: 10 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  contact: { fontSize: 10, color: "#444", marginBottom: 2 },
  date: { marginTop: 20, marginBottom: 20 },
  body: { marginBottom: 20 },
  paragraph: { marginBottom: 10 },
  signature: { marginTop: 30 },
});

// The PDF Document Template
const PDFDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.name || "Your Name"}</Text>
        <Text style={styles.contact}>{data.email} | {data.phone}</Text>
        <Text style={styles.contact}>{data.address} {data.cityStateZip}</Text>
      </View>
      <Text style={styles.date}>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Text>
      <View style={styles.body}>
        {data.letter.split("\n\n").map((p: string, i: number) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
      </View>
      <View style={styles.signature}>
        <Text>Sincerely,</Text>
        <Text style={{ marginTop: 40 }}>{data.name || "Candidate"}</Text>
      </View>
    </Page>
  </Document>
);

// The Interactive Component
export default function CoverLetterFinalizer({ initialLetter }: { initialLetter: string }) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", cityStateZip: "", letter: initialLetter,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
      {/* LEFT: Inputs */}
      <div className="space-y-6">
        <Card>
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">1. Finalize Details</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block"><Label htmlFor="name" value="Full Name" /></div>
              <TextInput id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 block"><Label htmlFor="email" value="Email" /></div>
                <TextInput id="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <div className="mb-2 block"><Label htmlFor="phone" value="Phone" /></div>
                <TextInput id="phone" name="phone" placeholder="(555) 123-4567" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="letter" value="Edit Letter Content" /></div>
              <Textarea id="letter" name="letter" rows={10} value={formData.letter} onChange={handleChange} />
            </div>
          </div>
        </Card>
      </div>

      {/* RIGHT: Preview & Download */}
      <div className="space-y-6">
        <Card className="bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">2. Download PDF</h3>
          <div className="bg-white dark:bg-gray-900 p-6 shadow-sm border rounded mb-6 min-h-[300px] text-[10px] leading-relaxed opacity-80 select-none text-gray-800 dark:text-gray-300">
            <p className="font-bold text-lg">{formData.name || "Your Name"}</p>
            <p>{formData.email} | {formData.phone}</p>
            <hr className="my-2 border-gray-300" />
            <p className="whitespace-pre-wrap">{formData.letter.substring(0, 300)}...</p>
            <p className="text-center mt-10 text-gray-400 italic">(Preview)</p>
          </div>

          <PDFDownloadLink
            document={<PDFDocument data={formData} />}
            fileName={`Cover_Letter_${formData.name.replace(/\s+/g, "_") || "JobAppAI"}.pdf`}
          >
            {({ loading }) => (
              <Button size="xl" gradientDuoTone="greenToBlue" className="w-full" disabled={loading || !formData.name}>
                {loading ? <Spinner size="sm" className="mr-2" /> : <HiDownload className="mr-2 h-5 w-5" />}
                {formData.name ? "Download Official PDF" : "Enter Name to Unlock"}
              </Button>
            )}
          </PDFDownloadLink>
        </Card>

        <div className="text-center">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1">
                Skip to Dashboard <HiArrowRight />
            </Link>
        </div>
      </div>
    </div>
  );
}