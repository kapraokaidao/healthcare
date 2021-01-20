import 'package:equatable/equatable.dart';
import 'package:healthcare_app/models/patient.dart';

class User extends Equatable {
  final int id;
  final String telNo;
  final String email;
  final Patient patient;
  final bool isRegistered;
  final bool isAcceptedTerm;

  const User(
      {this.id,
        this.email,
        this.telNo,
        this.patient,
        this.isRegistered,
        this.isAcceptedTerm});

  factory User.fromJSON(dynamic json) {
    return User(
      id: json["id"],
      telNo: json["telNo"],
      email: json["email"],
      patient: json["patient"] != null ? Patient.fromJSON(json["patient"]) : null,
      isRegistered: json["isRegistered"] ?? false,
      isAcceptedTerm: json["isAcceptedTerm"] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    var map = <String, dynamic>{};
    map["email"] = email;
    map["telNo"] = telNo;
    map["patient"] = patient != null ? patient.toJson() : null;

    return map;
  }

  User copyWith({
    String email,
    String telNo,
    Patient patient,
  }) {
    return User(
      id: this.id,
      email: email ?? this.email,
      telNo: telNo ??this.telNo,
      patient: patient ?? this.patient,
      isRegistered: this.isRegistered,
      isAcceptedTerm: this.isAcceptedTerm,
    );
  }

  @override
  List<Object> get props => [id, telNo, email, patient, isRegistered, isAcceptedTerm];
}
