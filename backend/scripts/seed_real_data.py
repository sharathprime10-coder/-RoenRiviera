import os
import sys

# Add the backend directory to python path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.db import get_supabase_client, get_embeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.documents import Document

def seed_database():
    """Seed the Supabase database with realistic data."""
    print("Initializing Supabase client and Embeddings...")
    try:
        supabase = get_supabase_client()
        embeddings = get_embeddings()
    except Exception as e:
        print(f"Error initializing: {e}")
        return

    # A collection of real-world chunks for a university setting.
    raw_documents = [
        # Academic Rules & Grading
        {"doc_name": "Academic Regulations", "section": "Grading System", "text": "The grading system at RoenRiviera follows a 10-point scale. A grade of 'O' (Outstanding) is 10 points, 'A+' (Excellent) is 9 points, 'A' (Very Good) is 8 points, 'B+' (Good) is 7 points, 'B' (Above Average) is 6 points, 'C' (Average) is 5 points, 'P' (Pass) is 4 points, and 'F' (Fail) is 0 points."},
        {"doc_name": "Academic Regulations", "section": "Attendance Policy", "text": "Students must maintain a minimum of 75% attendance in each course to be eligible to appear for the end-semester examinations. Medical leave up to 10% may be granted with proper documentation from a registered medical practitioner, subject to approval by the Head of Department."},
        {"doc_name": "Academic Regulations", "section": "Make-up Exams", "text": "Make-up examinations are only permitted for students who missed the regular end-semester exam due to severe illness or unforeseen emergencies. Applications must be submitted within 3 days of the missed exam, along with valid proof."},
        
        # Syllabi (Computer Science)
        {"doc_name": "CS201 Syllabus", "section": "Data Structures", "text": "Course CS201 covers Advanced Data Structures. Unit 1: Asymptotic Analysis and Recursion. Unit 2: Advanced Trees (AVL, Red-Black, B-Trees). Unit 3: Graph Algorithms (Dijkstra, Bellman-Ford, Kruskal, Prim). Unit 4: Hashing and Collision Resolution. Unit 5: Dynamic Programming & Greedy Algorithms."},
        {"doc_name": "CS201 Syllabus", "section": "Assessments", "text": "Assessment for CS201: Midterm Exam (20%), Programming Assignments (30%), Quizzes (10%), and Final End-Semester Exam (40%). Passing criteria requires an aggregate of at least 40% across all assessments."},
        {"doc_name": "CS305 Syllabus", "section": "Operating Systems", "text": "CS305 Operating Systems. Unit 1 focuses on OS Structures and System Calls. Unit 2 covers Process Management, Scheduling algorithms, and IPC. Unit 3 details Memory Management, Paging, and Virtual Memory. Unit 4 is on File Systems and Mass Storage. Unit 5 covers Deadlocks and Security."},
        
        # Campus Facilities
        {"doc_name": "Campus Guide", "section": "Library", "text": "The Central Library is open from 8:00 AM to 11:30 PM on weekdays, and 9:00 AM to 8:00 PM on weekends. During exam weeks, the ground floor reading room remains open 24/7. Students can borrow up to 4 books at a time for a period of 14 days."},
        {"doc_name": "Campus Guide", "section": "Cafeterias", "text": "There are three main cafeterias on campus. The Main Canteen (Block A) operates 7 AM - 10 PM. The Tech Park Cafe serves snacks and beverages from 9 AM - 6 PM. The Midnight Bites food truck operates near the hostels from 10 PM to 2 AM."},
        {"doc_name": "Campus Guide", "section": "Sports", "text": "The sports complex features an Olympic-size swimming pool, three indoor badminton courts, a fully equipped gymnasium, and outdoor fields for cricket and football. The complex is open from 6:00 AM to 9:00 AM, and 4:00 PM to 9:00 PM daily."},
        
        # Hostels & Housing
        {"doc_name": "Hostel Manual", "section": "Curfew", "text": "The standard hostel curfew for all undergraduate residents is 9:30 PM. Late entry is permitted up to 10:30 PM with a late pass, which can be applied for via the student portal. Biometric attendance is recorded daily at 9:30 PM."},
        {"doc_name": "Hostel Manual", "section": "Room Allotment", "text": "Rooms are allotted on a first-come, first-served basis during the registration period. Options include AC/Non-AC, and 2-bed, 3-bed, or 4-bed configurations. Changing rooms during the semester is not permitted unless there is a verified medical reason."},
        
        # Career & Placements
        {"doc_name": "Placement Brochure", "section": "Eligibility", "text": "To be eligible for campus placements, a student must have a CGPA of 6.0 or above, with no active backlogs at the time of registration. Students must have at least 75% attendance in the pre-placement training sessions."},
        {"doc_name": "Placement Brochure", "section": "Internships", "text": "The mandatory 6-month industrial internship takes place during the 8th semester for B.Tech students. Companies visiting for campus placements may offer Pre-Placement Offers (PPOs) based on internship performance."},
        
        # Financial / Admin
        {"doc_name": "Admin Policies", "section": "Fee Payment", "text": "Semester fees must be paid within the first two weeks of the semester. Late payments attract a fine of Rs. 100 per day for the next 15 days, after which the student's registration may be suspended."},
        {"doc_name": "Admin Policies", "section": "Scholarships", "text": "Merit scholarships are awarded to the top 5% of students in each branch based on CGPA. The scholarship provides a 50% tuition fee waiver for the subsequent academic year."}
    ]

    docs = []
    for idx, item in enumerate(raw_documents):
        docs.append(
            Document(
                page_content=item["text"],
                metadata={
                    "document_id": f"real_doc_{idx}",
                    "document_name": item["doc_name"],
                    "section": item["section"]
                }
            )
        )

    print(f"Uploading {len(docs)} real documents to Supabase...")
    try:
        SupabaseVectorStore.from_documents(
            docs,
            embeddings,
            client=supabase,
            table_name="documents",
            query_name="match_documents"
        )
        print("Successfully seeded the database with realistic data!")
    except Exception as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed_database()
