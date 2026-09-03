'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { parseBullets } from '@/lib/cv/descriptions';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    fontSize: 8,
    color: '#4a4a4a',
  },
  contactItem: {
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#888',
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  experienceEntry: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  position: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  dateRange: {
    fontSize: 8,
    color: '#666',
  },
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  company: {
    fontSize: 9,
    color: '#333',
  },
  location: {
    fontSize: 8,
    color: '#666',
  },
  description: {
    fontSize: 8,
    marginTop: 2,
    lineHeight: 1.3,
    color: '#2a2a2a',
  },
  bulletRow: {
    flexDirection: 'row',
    marginTop: 1,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 8,
    width: 10,
  },
  bulletText: {
    fontSize: 8,
    lineHeight: 1.3,
    color: '#2a2a2a',
    flex: 1,
  },
  educationEntry: {
    marginBottom: 6,
  },
  degree: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  institution: {
    fontSize: 8,
    color: '#333',
  },
  field: {
    fontSize: 8,
    color: '#555',
  },
  skillsCategory: {
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  skillsList: {
    fontSize: 8,
    color: '#444',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  languageItem: {
    fontSize: 8,
  },
});

const MONTHS_ES = ['', 'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
const MONTHS_EN = ['', 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

interface Props {
  data: CVData;
  dict: Dictionary;
}

export function CVDocument({ data, dict }: Props) {
  const { personalInfo, summary, experience, education, skills, languages, language } = data;

  const formatDate = (date: string | undefined, lang: 'es' | 'en') => {
    if (!date) return '';
    const parts = date.split(/[\/-]/);
    if (parts.length !== 2) return date;
    let month = parts[0];
    let year = parts[1];
    if (parts[0].length === 4) {
      year = parts[0];
      month = parts[1];
    }
    const months = lang === 'en' ? MONTHS_EN : MONTHS_ES;
    const monthName = months[parseInt(month, 10)] || month;
    return `${monthName} ${year}`;
  };

  const summaryContent = language === 'es' ? summary.es : summary.en;
  const expPosition = (exp: CVData['experience'][0]) =>
    language === 'es' ? exp.position.es : exp.position.en;
  const expDesc = (exp: CVData['experience'][0]) =>
    language === 'es' ? exp.descriptions.es : exp.descriptions.en;

  const renderDescription = (text: string) => {
    if (!text) return null;
    const result = parseBullets(text);
    if (result) {
      return result.items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bullet}>{result.bullet}</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ));
    }
    return <Text style={styles.description}>{text}</Text>;
  };
  const eduDegree = (edu: CVData['education'][0]) =>
    language === 'es' ? edu.degree.es : edu.degree.en;
  const eduField = (edu: CVData['education'][0]) =>
    language === 'es' ? edu.field.es : edu.field.en;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <View style={styles.contactRow}>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>}
            {personalInfo.website && <Text style={styles.contactItem}>{personalInfo.website}</Text>}
          </View>
        </View>

        {summaryContent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{dict.form.summary}</Text>
            <Text style={styles.summaryText}>{summaryContent}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{dict.form.experience}</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.experienceEntry}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.position}>{expPosition(exp)}</Text>
                  <Text style={styles.dateRange}>
                    {formatDate(exp.startDate, language)} — {exp.current ? 'Present' : formatDate(exp.endDate, language)}
                  </Text>
                </View>
                <View style={styles.companyRow}>
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.location}>{exp.location}</Text>
                </View>
                {renderDescription(expDesc(exp))}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{dict.form.education}</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.educationEntry}>
                <Text style={styles.degree}>
                  {eduDegree(edu)} — {eduField(edu)}
                </Text>
                <View style={styles.companyRow}>
                  <Text style={styles.institution}>{edu.institution}</Text>
                  <Text style={styles.dateRange}>
                    {formatDate(edu.startDate, language)} — {formatDate(edu.endDate, language)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{dict.form.skills}</Text>
            {skills.map((cat) => (
              <View key={cat.id} style={styles.skillsCategory}>
                <Text style={styles.categoryName}>{cat.category}:</Text>
                <Text style={styles.skillsList}>{cat.skills.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{dict.form.languages}</Text>
            <View style={styles.languagesContainer}>
              {languages.map((lang) => (
                <Text key={lang.id} style={styles.languageItem}>
                  {lang.language} — {lang.level}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
