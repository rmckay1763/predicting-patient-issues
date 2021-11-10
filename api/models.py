from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class Diagnosis(BaseModel):
    diagnosisid: int
    patientunitstayid: int
    activeupondischarge: Optional[str] = ""
    diagnosisoffset: int
    diagnosisstring: str
    icd9code: Optional[str] = ""
    diagnosispriority: str

