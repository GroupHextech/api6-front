import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export default function TermsAndConditions({ open, onAgree, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} scroll="body">
      <DialogTitle>Terms of Use</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          <p>...</p>

          <h2>Data Sharing Consent Agreement</h2>
          <p>
            In compliance with the Brazilian General Data Protection Law (LGPD),
            Law No. 13,709/2018, this Data Sharing Consent Agreement
            ("Agreement") aims to document your free, express, and unequivocal
            consent to the sharing of your personal data by Hextech ("Company").
          </p>

          <h3>1. Purpose of Consent</h3>
          <p>
            You consent to the sharing of your personal data with the following
            entities: B2W Companhia Digital, for the following purposes:
            Sentiment analysis of product reviews.
          </p>

          <h3>2. Security Measures</h3>
          <p>
            The Company will implement adequate technical and administrative
            security measures to protect your personal data from unauthorized
            access, destruction, loss, alteration, communication, or any form of
            inappropriate or unlawful treatment.
          </p>

          <h3>3. Rights of the Data Subject</h3>
          <p>
            As the owner of your personal data, you have the following rights:
          </p>

          <ul>
            <li>
              Right of access: Request information about your personal data,
              including its origin, purpose of processing, and recipients.
            </li>
            <li>
              Right to rectification: Request the correction of your personal
              data if it is incorrect or incomplete.
            </li>
            <li>
              Right to erasure: Request the deletion of your personal data,
              provided that the legal requirements are applicable.
            </li>
            <li>
              Right to data portability: Request to receive your personal data
              in a structured, commonly used, and machine-readable format, and
              to transfer it to another controller, when technically possible.
            </li>
            <li>
              Right to object: Object to the processing of your personal data
              for certain purposes, including profiling.
            </li>
            <li>
              Right to withdraw consent: Withdraw this consent at any time, by
              notifying the Company.
            </li>
          </ul>

          <h3>4. Final Provisions</h3>
          <p>
            This Agreement constitutes the entire agreement between the parties
            regarding the sharing of your personal data. The Company may modify
            this Agreement at any time, upon prior notice.
          </p>

          <p>
            By using our services, you declare that you have read, understood,
            and agree to the terms described in these Terms of Use, including
            the Data Sharing Consent Agreement.
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onAgree}>Agree</Button>
      </DialogActions>
    </Dialog>
  );
}
