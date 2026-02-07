"use client";

import { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import { Card, CardContent, CardHeader } from "@/components/card-saas";
import {
  Download,
  Edit,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Loader,
} from "lucide-react";
import Link from "next/link";

// Register Font
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf",
    },
  ],
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    borderBottom: "1pt solid #000",
    paddingBottom: 10,
  },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  contact: { fontSize: 10, color: "#666", marginBottom: 2 },
  date: { marginTop: 20, marginBottom: 20 },
  body: { marginBottom: 20 },
  paragraph: { marginBottom: 10 },
  signature: { marginTop: 30 },
});

// PDF Document
const PDFDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.name || "Your Name"}</Text>
        <Text style={styles.contact}>
          {data.email} | {data.phone}
        </Text>
        <Text style={styles.contact}>
          {data.address} {data.cityStateZip}
        </Text>
      </View>
      <Text style={styles.date}>
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
      <View style={styles.body}>
        {data.letter.split("\n\n").map((p: string, i: number) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}
      </View>
      <View style={styles.signature}>
        <Text>Sincerely,</Text>
        <Text style={{ marginTop: 40 }}>{data.name || "Candidate"}</Text>
      </View>
    </Page>
  </Document>
);

// Main Component
export default function CoverLetterFinalizer({
  initialLetter,
}: {
  initialLetter: string;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cityStateZip: "",
    letter: initialLetter,
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormComplete = formData.name && formData.email && formData.phone;

  return (
    <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
      {/* LEFT: Form Inputs */}
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 1</h3>
                <p className="text-sm text-muted-foreground">
                  Finalize your details
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Address Fields */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                Address (Optional)
              </label>
              <input
                type="text"
                name="address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all mb-2"
              />
              <input
                type="text"
                name="cityStateZip"
                placeholder="New York, NY 10001"
                value={formData.cityStateZip}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Letter Editor Toggle */}
            <button
              onClick={() => setEditMode(!editMode)}
              className="w-full px-4 py-2 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-all duration-300"
            >
              {editMode ? "Done Editing" : "Edit Letter Content"}
            </button>

            {/* Conditional Letter Textarea */}
            {editMode && (
              <div className="space-y-2 pt-4 border-t border-border">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Letter Content
                </label>
                <textarea
                  name="letter"
                  value={formData.letter}
                  onChange={handleChange}
                  rows={10}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: Preview & Download */}
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Step 2</h3>
                <p className="text-sm text-muted-foreground">Download as PDF</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 bg-background max-h-96 overflow-y-auto">
              <div className="text-sm text-foreground/80 space-y-2 whitespace-pre-wrap font-mono">
                <p className="font-bold text-base">
                  {formData.name || "Your Name"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.email} | {formData.phone}
                </p>
                {(formData.address || formData.cityStateZip) && (
                  <p className="text-xs text-muted-foreground">
                    {formData.address} {formData.cityStateZip}
                  </p>
                )}
                <div className="border-t border-border my-2" />
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-foreground/60">
                  {formData.letter.substring(0, 200)}...
                </p>
              </div>
            </div>

            {/* Download Button */}
            <PDFDownloadLink
              document={<PDFDocument data={formData} />}
              fileName={`Cover_Letter_${formData.name.replace(/\s+/g, "_") || "JobAppAI"}.pdf`}
            >
              {({ loading }) => (
                <button
                  disabled={loading || !isFormComplete}
                  className={`w-full px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isFormComplete
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      {formData.name
                        ? "Download Cover Letter"
                        : "Enter Your Name to Unlock"}
                    </>
                  )}
                </button>
              )}
            </PDFDownloadLink>

            {/* Secondary CTA */}
            <Link
              href="/dashboard"
              className="block text-center text-sm font-semibold text-primary hover:underline py-2 transition-colors"
            >
              Skip to Dashboard →
            </Link>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-secondary/30 border-border">
          <CardContent className="pt-6 pb-6 space-y-3">
            <h4 className="font-bold text-foreground">💡 Pro Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ Customize the letter with specific examples</li>
              <li>✓ Use keywords from the job description</li>
              <li>✓ Keep it concise and professional</li>
              <li>✓ Proofread before sending</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}