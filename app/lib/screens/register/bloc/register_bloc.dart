import 'dart:async';
import 'package:healthcare_app/repositories/user_repository.dart';
import 'package:meta/meta.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:healthcare_app/repositories/register_repository.dart';

part 'register_event.dart';
part 'register_state.dart';

class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  final RegisterRepository _registerRepository;

  // StreamSubscription<AuthenticationStatus> _authenticationStatusSubscription;
  StreamSubscription<RegisterStep> _registerStepSubscription;

  RegisterBloc({@required RegisterRepository registerRepository})
      : assert(registerRepository != null),
        _registerRepository = registerRepository,
        super(RegisterState.inputInfo()) {
    _registerStepSubscription = _registerRepository.step.listen((step) => add(RegisterStepChanged(step)));
  }

  @override
  Stream<RegisterState> mapEventToState(RegisterEvent event) async* {
    if (event is RegisterStepChanged) {
      yield _mapRegisterStepChangedToState(event);
    } else if (event is RegisterFirstnameChanged) {
      yield _mapFirstnameChangedToState(event);
    } else if (event is RegisterLastnameChanged) {
      yield _mapLastnameChangedToState(event);
    }
  }

  RegisterState _mapRegisterStepChangedToState(RegisterStepChanged event) {
    final step = event.step;
    return state.copyWith(step: step);
  }

  RegisterState _mapFirstnameChangedToState(RegisterFirstnameChanged event) {
    final firstname = event.firstname;
    return state.copyWith(firstname: firstname);
  }

  RegisterState _mapLastnameChangedToState(RegisterLastnameChanged event) {
    final lastname = event.lastname;
    return state.copyWith(lastname: lastname);
  }
}
