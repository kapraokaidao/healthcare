import 'package:equatable/equatable.dart';

class Patient extends Equatable {
  final int id;
  final String nationalId;
  final String gender;
  final String birthDate;
  final bool approved;
  final String nationalIdImage;
  final String selfieImage;

  const Patient({
    this.id,
    this.nationalId,
    this.gender,
    this.birthDate,
    this.approved,
    this.nationalIdImage,
    this.selfieImage
  });
/*
* "id": 3,
    "nationalId": "patient",
    "gender": "Male",
    "birthDate": "2020-12-17",
    "approved": false,
    "nationalIdImage": "https://healthcare-kyc-image.s3.ap-southeast-1.amazonaws.com/user_231/reset-password/national-id_1609604421838.jpg",
    "selfieImage": "https://healthcare-kyc-image.s3.ap-southeast-1.amazonaws.com/user_231/reset-password/selfie_1609604440913.jpg"
    * */

  factory Patient.fromJSON(dynamic json) {
    return Patient(
      id: json["id"],
      nationalId: json["nationalId"],
      gender: json["gender"],
      birthDate: json["birthDate"],
      approved: json["approved"],
      nationalIdImage: json["nationalIdImage"],
      selfieImage: json["selfieImage"]
    );
  }

  Patient copyWith({
    String nationalId,
    String gender,
    String birthDate,
    bool approved,
    String nationalIdImage,
    String selfieImage,
  }) {
    return Patient(
      id: this.id,
      nationalId: nationalId ?? this.nationalId,
      gender: gender ?? this.gender,
      birthDate: birthDate ?? this.birthDate,
      approved: approved ?? this.approved,
      nationalIdImage: nationalIdImage ?? this.nationalIdImage,
      selfieImage: selfieImage ?? this.selfieImage,
    );
  }

  Map<String, dynamic> toJson() {
    var map = <String, dynamic>{};
    map["id"] = id;
    map["nationalId"] = nationalId;
    map["gender"] = gender;
    map["birthDate"] = birthDate;
    map["approved"] = approved;
    map["nationalIdImage"] = nationalIdImage;
    map["selfieImage"] = selfieImage;

    return map;
  }

  @override
  List<Object> get props => [id, nationalId, birthDate, gender, approved, nationalIdImage, selfieImage];
}
