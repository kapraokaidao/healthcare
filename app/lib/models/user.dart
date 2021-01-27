import 'package:equatable/equatable.dart';
import 'package:healthcare_app/models/patient.dart';

class User extends Equatable {
  final int id;
  final String username;
  final String firstname;
  final String lastname;
  final String role;
  final String phone;
  final String address;
  final Patient patient;

  const User(
      {this.id,
        this.username,
        this.firstname,
        this.lastname,
        this.role,
        this.phone,
        this.address,
        this.patient});
/*
* "id": 231,
  "username": "patient",
  "firstname": "patient",
  "lastname": "",
  "role": "Patient",
  "phone": "patient",
  "address": "patient",
  "createdDate": "2020-12-17T17:59:18.718Z",
  "updatedDate": "2021-01-04T12:51:01.000Z",
  "deletedDate": null,
* */
  factory User.fromJSON(dynamic json) {
    return User(
      id: json["id"],
      username: json["username"],
      firstname: json["firstname"],
      lastname: json["lastname"],
      role: json["role"],
      phone: json["phone"],
      address: json["address"],
      patient: json["patient"] != null ? Patient.fromJSON(json["patient"]) : null,
    );
  }

  Map<String, dynamic> toJson() {
    var map = <String, dynamic>{};
    map["id"] = id;
    map["username"] = username;
    map["firstname"] = firstname;
    map["lastname"] = lastname;
    map["role"] = role;
    map["phone"] = phone;
    map["address"] = address;
    map["patient"] = patient != null ? patient.toJson() : null;

    return map;
  }

  User copyWith({
    String username,
    String firstname,
    String lastname,
    String role,
    String phone,
    String address,
    Patient patient,
  }) {
    return User(
      id: this.id,
      username: username ?? this.username,
      firstname: firstname ?? this.firstname,
      lastname: lastname ?? this.lastname,
      role: role ?? this.role,
      phone: phone ?? this.phone,
      address: address ?? this.address,
      patient: patient ?? this.patient,
    );
  }

  @override
  List<Object> get props => [id, username, firstname, lastname, role, phone, address, patient];
}
