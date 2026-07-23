# PDF Import Feature

Import your existing CV from a PDF file to automatically fill in the form.

## How it works

1. Click the **Import PDF** button on the CV form page
2. Select your existing CV PDF file
3. The system will:
   - Extract text from your PDF using `pdfjs-dist`
   - Send the text to OpenAI for parsing
   - Automatically fill in the form with extracted data

## Requirements

- A PDF file with readable text (not scanned images)
- OpenAI API key configured in `.env.local`

## Configuration

Add your OpenAI API key to `.env.local`:

```bash
OPENAI_API_KEY=sk-your-key-here
```

Get your API key at: https://platform.openai.com/api-keys

## Error States

| Error | Cause | Solution |
|-------|-------|----------|
| "AI not configured" | No API key found | Add `OPENAI_API_KEY` to `.env.local` |
| "Failed to parse PDF" | OpenAI couldn't extract data | Make sure PDF has selectable text |
| "Error importing PDF" | PDF extraction failed | Ensure the file is a valid PDF |

## Supported Fields

The AI parser extracts:

- **Personal Info**: Name, email, phone, location, LinkedIn, website
- **Summary**: Professional summary in ES/EN
- **Experience**: Company, position, dates, descriptions
- **Education**: Institution, degree, field, dates
- **Skills**: Categorized skill lists
- **Languages**: Language + proficiency level

## Limitations

- Scanned PDFs (images) cannot be parsed — only text-based PDFs
- Translation quality depends on the original CV language
- You should always review and correct the auto-filled data
