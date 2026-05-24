package com.smartportal.repository;

import com.smartportal.model.Job;
import java.util.List;

public interface JobRepository {
    List<Job> findAll();
    Job findById(Long id);
    void save(Job job);
    // Add custom matching queries here
}
