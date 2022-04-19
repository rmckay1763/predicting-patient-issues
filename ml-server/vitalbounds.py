from dataclasses import dataclass

@dataclass
class Bound:
    lower: int
    upper: int

@dataclass
class VitalBounds:
    heartrate: Bound
    respiration: Bound
    sao2: Bound
    systolic: Bound
    diastolic: Bound