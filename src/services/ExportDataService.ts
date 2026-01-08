// Service for exporting profile data in various formats

import { Profile } from '../types/Profile';

export class ExportDataService {
  /**
   * Exports profiles as JSON and triggers download
   * @param profiles Array of profiles to export
   */
  static exportAsJson(profiles: Profile[]): void {
    if (profiles.length === 0) {
      console.warn('No profiles to export');
      return;
    }

    const jsonString = JSON.stringify(profiles, null, 2);
    this.triggerDownload(jsonString, 'profiles.json', 'application/json');
  }

  /**
   * Exports profiles as Markdown and triggers download
   * @param profiles Array of profiles to export
   */
  static exportAsMarkdown(profiles: Profile[]): void {
    if (profiles.length === 0) {
      console.warn('No profiles to export');
      return;
    }

    let markdown = '# LinkedIn Profiles\n\n';
    markdown += `Exported: ${new Date().toLocaleString()}\n\n`;
    markdown += `Total Profiles: ${profiles.length}\n\n`;
    markdown += '---\n\n';

    for (const profile of profiles) {
      markdown += `## ${profile.name}\n\n`;
      markdown += `**Title:** ${profile.title}\n\n`;
      markdown += `**LinkedIn:** [${profile.linkedinUrl}](${profile.linkedinUrl})\n\n`;

      if (profile.summary) {
        markdown += `**Summary:**\n${profile.summary}\n\n`;
      }

      if (profile.tags && profile.tags.length > 0) {
        markdown += `**Tags:** ${profile.tags.join(', ')}\n\n`;
      }

      if (profile.experience && profile.experience.length > 0) {
        markdown += `**Experience:**\n`;
        for (const exp of profile.experience) {
          markdown += `- ${exp}\n`;
        }
        markdown += '\n';
      }

      if (profile.education && profile.education.length > 0) {
        markdown += `**Education:**\n`;
        for (const edu of profile.education) {
          markdown += `- ${edu}\n`;
        }
        markdown += '\n';
      }

      markdown += `**Added:** ${new Date(profile.createdAt).toLocaleString()}\n\n`;
      markdown += '---\n\n';
    }

    this.triggerDownload(markdown, 'profiles.md', 'text/markdown');
  }

  /**
   * Exports profiles as CSV and triggers download
   * @param profiles Array of profiles to export
   */
  static exportAsCsv(profiles: Profile[]): void {
    if (profiles.length === 0) {
      console.warn('No profiles to export');
      return;
    }

    // CSV headers
    const headers = [
      'Name',
      'Title',
      'LinkedIn URL',
      'Summary',
      'Tags',
      'Experience',
      'Education',
      'Date Added'
    ];

    let csv = headers.map(h => this.escapeCsvField(h)).join(',') + '\n';

    // Add rows
    for (const profile of profiles) {
      const row = [
        profile.name,
        profile.title,
        profile.linkedinUrl,
        profile.summary,
        profile.tags.join('; '),
        profile.experience.join('; '),
        profile.education.join('; '),
        new Date(profile.createdAt).toLocaleString()
      ];

      csv += row.map(field => this.escapeCsvField(field)).join(',') + '\n';
    }

    this.triggerDownload(csv, 'profiles.csv', 'text/csv');
  }

  /**
   * Escapes a field for CSV format
   */
  private static escapeCsvField(field: string): string {
    if (!field) return '""';

    const fieldStr = String(field);

    // If field contains comma, quote, or newline, wrap in quotes and escape quotes
    if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
      return `"${fieldStr.replace(/"/g, '""')}"`;
    }

    return fieldStr;
  }

  /**
   * Triggers a download for the given content
   */
  private static triggerDownload(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    console.log('Export triggered:', filename);
  }
}
