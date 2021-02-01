part of 'register_bloc.dart';

class RegisterState extends Equatable {
  final RegisterStep step;
  final String firstname;
  final String lastname;
  final UserGender gender;
  final DateTime birthdate;
  final String address;
  final String phone;
  final String nationalId;
  final String pin;



  const RegisterState({
    this.step = RegisterStep.inputInfo,
    this.firstname = '',
    this.lastname = '',
    this.gender = UserGender.male,
    this.birthdate,
    this.address = '',
    this.phone = '',
    this.nationalId = '',
    this.pin = ''
  });

  const RegisterState.inputInfo(): this(step: RegisterStep.inputInfo);

  const RegisterState.uploadPhoto(): this(step: RegisterStep.uploadPhoto);

  const RegisterState.inputCredential(): this(step: RegisterStep.inputCredential);

  RegisterState copyWith({
    RegisterStep step,
    String firstname,
    String lastname,
    UserGender gender,
    DateTime birthdate,
    String address,
    String phone,
    String nationalId,
    String pin,
  }) {
    return RegisterState(
      step: step ?? this.step,
      firstname: firstname ?? this.firstname,
      lastname: lastname ?? this.lastname,
      gender: gender ?? this.gender,
      birthdate: birthdate ?? this.birthdate,
      address: address ?? this.address,
      phone: phone ?? this.phone,
      nationalId: nationalId ?? this.nationalId,
      pin: pin ?? this.pin
    );
  }

  @override
  List<Object> get props => [step, firstname, lastname, gender, birthdate, address, phone, nationalId, pin];

}