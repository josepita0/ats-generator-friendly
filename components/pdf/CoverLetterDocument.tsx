'use client';

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { PersonalInfo } from '@/types/cv';
import type { Dictionary } from '@/lib/i18n/dictionaries';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1a1a1a',
    lineHeight: 1.5,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    fontSize: 8,
    color: '#4a4a4a',
    marginTop: 2,
  },
  contactItem: {
    marginHorizontal: 2,
  },
  separator: {
    marginHorizontal: 4,
    color: '#999',
  },
  date: {
    fontSize: 10,
    color: '#444',
    marginBottom: 20,
  },
  body: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1a1a1a',
  },
});

const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface Props {
  personalInfo: PersonalInfo;
  body: string;
  language: 'es' | 'en';
  dict: Dictionary;
}

export function CoverLetterDocument({ personalInfo, body, language }: Props) {
  const now = new Date();
  const day = now.getDate();
  const year = now.getFullYear();

  const dateFormatted =
    language === 'es'
      ? `${day} de ${MONTHS_ES[now.getMonth()]} de ${year}`
      : `${MONTHS_EN[now.getMonth()]} ${day}, ${year}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <View style={styles.contactRow}>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && (
              <>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.contactItem}>{personalInfo.phone}</Text>
              </>
            )}
            {personalInfo.location && (
              <>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.contactItem}>{personalInfo.location}</Text>
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <Text style={styles.separator}>|</Text>
                <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>
              </>
            )}
          </View>
        </View>

        <Text style={styles.date}>{dateFormatted}</Text>

        <Text style={styles.body}>{body}</Text>
      </Page>
    </Document>
  );
}
