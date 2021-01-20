import 'package:equatable/equatable.dart';

class Patient extends Equatable {
  final int id;
  final String name;
  final String birthDate;
  final String gender;

  const Patient({
    this.id,
    this.name,
    this.birthDate,
    this.gender,
  });

  factory Patient.fromJSON(dynamic json) {
    return Patient(
      id: json["id"],
      name: json["name"],
      birthDate: json["birthDate"],
      gender: json["gender"],
    );
  }

  Patient copyWith({
    String name,
    String birthDate,
    String gender,
  }) {
    return Patient(
      id: this.id,
      name: name ?? this.name,
      birthDate: birthDate ?? this.birthDate,
      gender: gender ?? this.gender,
    );
  }

  Map<String, dynamic> toJson() {
    var map = <String, dynamic>{};
    map["name"] = name;
    map["birthDate"] = birthDate;
    map["gender"] = gender;

    return map;
  }

  @override
  List<Object> get props => [id, name, birthDate, gender];
}
