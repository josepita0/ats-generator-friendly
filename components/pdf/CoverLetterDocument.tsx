'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { PersonalInfo } from '@/types/cv';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { formatCoverLetterDate } from '@/lib/i18n/dates';

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

interface Props {
  personalInfo: PersonalInfo;
  body: string;
  language: 'es' | 'en';
  dict: Dictionary;
}

export function CoverLetterDocument({ personalInfo, body, language }: Props) {
  const dateFormatted = formatCoverLetterDate(language);

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
