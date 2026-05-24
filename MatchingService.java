package com.smartportal.service;

import com.smartportal.model.Job;
import com.smartportal.model.Resume;
import java.util.List;
import java.util.stream.Collectors;

public class MatchingService {
    
    public List<Job> matchResumeWithJobs(Resume resume, List<Job> allJobs) {
        return allJobs.stream()
            .map(job -> {
                double score = calculateMatchScore(resume, job);
                job.setMatchScore(score);
                return job;
            })
            .filter(job -> job.getMatchScore() > 0.5) // Only high matches
            .sorted((j1, j2) -> Double.compare(j2.getMatchScore(), j1.getMatchScore()))
            .collect(Collectors.toList());
    }

    private double calculateMatchScore(Resume resume, Job job) {
        long matchedSkills = job.getRequiredSkills().stream()
            .filter(skill -> resume.getSkills().contains(skill))
            .count();
        
        return (double) matchedSkills / job.getRequiredSkills().size();
    }
}
