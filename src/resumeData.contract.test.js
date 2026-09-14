import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Contract test: guards the shape of public/resumeData.json against the
// props every component actually reads. If someone renames/removes a key
// here, components silently render blank instead of failing loudly, so
// this test exists to catch that at build time instead of in production.

const resumeData = JSON.parse(
  readFileSync(join(process.cwd(), 'public', 'resumeData.json'), 'utf-8')
);

describe('resumeData.json contract', () => {
  it('has a main section with the fields Header/About/Contact/Footer read', () => {
    expect(resumeData.main).toBeTypeOf('object');
    expect(resumeData.main.name).toBeTypeOf('string');
    expect(resumeData.main.occupation).toBeTypeOf('string');
    expect(resumeData.main.description).toBeTypeOf('string');
    expect(resumeData.main.email).toBeTypeOf('string');
    expect(resumeData.main.resumedownload).toBeTypeOf('string');
    expect(resumeData.main.address).toBeTypeOf('object');
    expect(resumeData.main.address).toHaveProperty('street');
    expect(resumeData.main.address).toHaveProperty('city');
    expect(resumeData.main.address).toHaveProperty('state');
    expect(resumeData.main.address).toHaveProperty('zip');
  });

  it('has a social array with name, url, and className for every entry', () => {
    expect(Array.isArray(resumeData.main.social)).toBe(true);
    expect(resumeData.main.social.length).toBeGreaterThan(0);
    for (const network of resumeData.main.social) {
      expect(network.name).toBeTypeOf('string');
      expect(network.url).toMatch(/^https?:\/\//);
      expect(network.className).toBeTypeOf('string');
    }
  });

  it('has a resume section with education, work, and skills arrays', () => {
    expect(resumeData.resume).toBeTypeOf('object');
    expect(Array.isArray(resumeData.resume.education)).toBe(true);
    expect(Array.isArray(resumeData.resume.work)).toBe(true);
    expect(Array.isArray(resumeData.resume.skills)).toBe(true);

    for (const job of resumeData.resume.work) {
      expect(job.company).toBeTypeOf('string');
      expect(job.title).toBeTypeOf('string');
      expect(job.years).toBeTypeOf('string');
      expect(job.description).toBeTypeOf('string');
    }
  });

  it('has a portfolio.projects array with title, category, image, and url for every entry', () => {
    expect(resumeData.portfolio).toBeTypeOf('object');
    expect(Array.isArray(resumeData.portfolio.projects)).toBe(true);
    expect(resumeData.portfolio.projects.length).toBeGreaterThan(0);

    for (const project of resumeData.portfolio.projects) {
      expect(project.title).toBeTypeOf('string');
      expect(project.category).toBeTypeOf('string');
      expect(project.image).toBeTypeOf('string');
      expect(project.url).toMatch(/^https?:\/\//);
    }
  });

  it('has a testimonials.testimonials array with text and user for every entry', () => {
    expect(resumeData.testimonials).toBeTypeOf('object');
    expect(Array.isArray(resumeData.testimonials.testimonials)).toBe(true);
    expect(resumeData.testimonials.testimonials.length).toBeGreaterThan(0);

    for (const testimonial of resumeData.testimonials.testimonials) {
      expect(testimonial.text).toBeTypeOf('string');
      expect(testimonial.user).toBeTypeOf('string');
    }
  });
});
