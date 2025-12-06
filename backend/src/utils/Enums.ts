enum UserRole {
    CANDIDATE = "CANDIDATE",
    RECRUITER = "RECRUITER",
}

enum CompanySector {
    IT = "IT",
    FINANCE = "FINANCE",
    HEALTHCARE = "HEALTHCARE",
    EDUCATION = "EDUCATION",
    MANUFACTURING = "MANUFACTURING",
}

enum CandidateQualification {
    GRADUATE = "GRADUATE",
    POST_GRADUATE = "POST_GRADUATE",
    DOCTORATE = "DOCTORATE",
}

enum JobApplicationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}

export {
    UserRole,
    CompanySector,
    CandidateQualification,
    JobApplicationStatus,
};